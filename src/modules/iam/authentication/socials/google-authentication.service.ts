import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';
import { AuthenticationService } from '../authentication.service';
import { PrismaService } from '../../../../prisma';

@Injectable()
export class GoogleAuthenticationService {
  private oauthClient: OAuth2Client;

  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthenticationService,
    private readonly prisma: PrismaService,
  ) {}

  onModuleInit() {
    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    const clientSecret = this.configService.get<string>('GOOGLE_CLIENT_SECRET');
    this.oauthClient = new OAuth2Client(clientId, clientSecret);
  }

  async authenticate(token: string) {
    try {
      const loginTicket = await this.oauthClient.verifyIdToken({
        idToken: token,
        audience: this.configService.get<string>('GOOGLE_CLIENT_ID'),
      });
      const { name, email, sub: googleId } = loginTicket.getPayload();
      const user = await this.prisma.user.findFirst({
        where: { googleId },
      });
      if (user) {
        return this.authService.generateToken(user);
      } else {
        const newUser = await this.prisma.user.create({
          data: {
            name,
            email,
            googleId,
          },
        });
        return this.authService.generateToken(newUser);
      }
    } catch (error) {
      const pgUniqueViolationCode = '23505';
      if (error.code === pgUniqueViolationCode) {
        throw new ConflictException();
      }
      throw new UnauthorizedException();
    }
  }
}
