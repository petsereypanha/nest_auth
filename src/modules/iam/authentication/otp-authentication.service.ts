import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../prisma';
import { authenticator } from 'otplib';

@Injectable()
export class OtpAuthenticationService {
  private readonly logger = new Logger(OtpAuthenticationService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async generateSecret(email: string) {
    const secret = authenticator.generateSecret();
    const appName = this.configService.getOrThrow('TFA_APP_NAME');
    const uri = authenticator.keyuri(email, appName, secret);
    this.logger.log(`Generated 2FA secret for user ${email}`);
    return {
      secret,
      uri,
    };
  }

  verifyCode(code: string, secret: string) {
    return authenticator.verify({
      token: code,
      secret,
    });
  }

  async enableTwoFactorForUser(email: string, secret: string) {
    const user = await this.prisma.user.findFirst({
      where: { email },
    });
    this.logger.log(`Enabling 2FA for user ${email}`);
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        twoFactorSecret: secret,
        isTwoFactorEnabled: true,
      },
    });
  }
}
