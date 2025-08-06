import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/google/login-mobile')
  async loginMobile(@Body('idToken') idToken: string) {
    try {
      return await this.authService.loginWithGoogle(idToken);
    } catch (e) {
      console.error('Google login mobile error:', e);
    }
  }
}
