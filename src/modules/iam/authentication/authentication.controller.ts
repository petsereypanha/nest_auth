import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Res,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthType } from '../enums/auth-type.enum';
import { Auth } from '../decorators/auth.decorator';
import { ActiveUserData } from '../interfaces/active-user-data.interface';
import { Response } from 'express';
import { OtpAuthenticationService } from './otp-authentication.service';
import { toFileStream } from 'qrcode';
import { ActiveUser } from '../decorators/active-user.decorator';

@Auth(AuthType.None)
@Controller('authentication')
export class AuthenticationController {
  private readonly logger = new Logger(AuthenticationController.name);
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly otpAuthService: OtpAuthenticationService,
  ) {}

  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.authenticationService.signUp(signUpDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  async signIn(@Body() signInDto: SignInDto) {
    return this.authenticationService.signIn(signInDto);
  }

  @Post('refresh-tokens')
  async refreshToken(@Body() refreshToken: RefreshTokenDto) {
    return this.authenticationService.refreshTokens(refreshToken);
  }

  @Auth(AuthType.Bearer)
  @HttpCode(HttpStatus.OK)
  @Post('2fa/generate')
  async generate2FAQrCode(
    @ActiveUser() user: ActiveUserData,
    @Res() response: Response,
  ) {
    const { secret, uri } = await this.otpAuthService.generateSecret(
      user.email,
    );
    await this.otpAuthService.enableTwoFactorForUser(user.email, secret);
    response.type('png');
    return toFileStream(response, uri);
  }
}
