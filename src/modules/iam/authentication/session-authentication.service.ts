import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../../prisma';
import { HashingService } from '../hashing/hashing.service';
import { SignInDto } from './dto/sign-in.dto';
import { OtpAuthenticationService } from './otp-authentication.service';

@Injectable()
export class SessionAuthenticationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hashing: HashingService,
    private readonly otpAuthService: OtpAuthenticationService,
  ) {}

  async signIn(signInDto: SignInDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: signInDto.email },
      });
      if (!user) throw new UnauthorizedException('User deos not exist');
      const isEqual = await this.hashing.compare(
        signInDto.password,
        user.password,
      );
      if (!isEqual) throw new UnauthorizedException('Invalid password');
      return user;
    } catch (error) {
      throw error;
    }
  }
}
