import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { HashingService } from '../hashing/hashing.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from 'src/modules/iam/config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import {
  InvalidatedRefreshTokenError,
  RefreshTokenIdsStorage,
} from './refresh-token-ids.storage';
import { User } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import { OtpAuthenticationService } from './otp-authentication.service';

@Injectable()
export class AuthenticationService {
  private readonly logger = new Logger(AuthenticationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly hashing: HashingService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly refreshTokenIdStorage: RefreshTokenIdsStorage,
    private readonly otpAuthService: OtpAuthenticationService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    try {
      const { email, password, name } = signUpDto;
      const existingUser = await this.prisma.user.findUnique({
        where: { email },
      });
      if (existingUser) throw new Error('User already exists');
      const hashedPassword = await this.hashing.hash(password);
      return await this.prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async signIn(singInDto: SignInDto) {
    try {
      const { email, password } = singInDto;
      const user = await this.prisma.user.findUnique({ where: { email } });
      if (!user) throw new Error('User not found');
      const isPasswordValid = await this.hashing.compare(
        password,
        user.password,
      );
      if (!isPasswordValid) throw new Error('Invalid password');
      if (user.isTwoFactorEnabled) {
        const isValid = this.otpAuthService.verifyCode(
          singInDto.tfaCode,
          user.twoFactorSecret,
        );
        if (!isValid) {
          throw new UnauthorizedException('Invalid 2FA code');
        }
      }
      return await this.generateToken(user);
    } catch (error) {
      throw error;
    }
  }

  async generateToken(user: User) {
    const refreshTokenId = randomUUID();
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<Partial<User>>(
        user.id,
        this.jwtConfiguration.accessTokenTtl,
        user,
      ),
      this.signToken(user.id, this.jwtConfiguration.refreshTokenTtl, {
        refreshTokenId,
      }),
    ]);
    await this.refreshTokenIdStorage.insert(user.id, refreshTokenId);
    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      const { sub: userId, refreshTokenId } =
        await this.jwtService.verifyAsync<{
          sub: string;
          refreshTokenId: string;
        }>(refreshTokenDto.refreshToken, {
          secret: this.jwtConfiguration.secret,
          audience: this.jwtConfiguration.audience,
          issuer: this.jwtConfiguration.issuer,
        });

      this.logger.log(`Token verified for user ${userId}`);

      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });
      this.logger.log(`User found: ${user.email}`);
      const isValid = await this.refreshTokenIdStorage.validate(
        user.id,
        refreshTokenId,
      );
      if (!isValid) {
        await this.refreshTokenIdStorage.invalidate(user.id);
        throw new UnauthorizedException('Access denied');
      }
      return await this.generateToken(user);
    } catch (error) {
      this.logger.error('Error refreshing token', error);
      if (error instanceof InvalidatedRefreshTokenError) {
        throw new UnauthorizedException('Access denied');
      }
      throw new UnauthorizedException();
    }
  }

  private async signToken<T>(userId: string, expiresIn: number, payload?: T) {
    return this.jwtService.sign(
      {
        sub: userId,
        ...payload,
      },
      {
        secret: this.jwtConfiguration.secret,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        expiresIn,
      },
    );
  }
}
