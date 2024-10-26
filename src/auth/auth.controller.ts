import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { VerifyOtp } from './dto/verifyOtp.dto';
import { AuthService } from './providers/auth.service';
import { MFAService } from './providers/mfa.service';
import { sendOtpDto } from './dto/sendOtp.dto';
import { SignUpDto } from './dto/singnUp.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private mfaService: MFAService,
  ) {}

  @Post('signup')
  signUp(@Body() signUpDto: SignUpDto): Promise<void> {
    return this.authService.signUp(signUpDto);
  }

  @Post('sendOtp')
  async generate2FA(@Body() sendOtpDto: sendOtpDto): Promise<any> {
    // Send the token via SMS
    return await this.mfaService.send2FAToken(sendOtpDto);
  }

  @Post('verifyOtp')
  async verify2FA(@Body() verifyOtp: VerifyOtp) {
    const isValid = await this.mfaService.verify2FAToken(verifyOtp);
    if (!isValid) {
      // return { message: 'Invalid 2FA token' };
      throw new UnauthorizedException();
    }
    return { message: '2FA verified successfully' };
  }

  // @Post('signin')
  // signIn(
  //   @Body() authCredentialsDto: AuthCredentialsDto,
  // ): Promise<{ accessToken: string }> {
  //   return this.authService.signIn(authCredentialsDto);
  // }
}
