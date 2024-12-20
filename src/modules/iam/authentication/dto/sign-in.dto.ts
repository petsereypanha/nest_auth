import {
  IsEmail,
  IsString,
  IsBoolean,
  IsOptional,
  MinLength,
  IsNumberString,
} from 'class-validator';

export class SignInDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @IsOptional()
  @IsBoolean()
  rememberMe?: boolean;

  @IsOptional()
  @IsNumberString()
  tfaCode?: string;
}