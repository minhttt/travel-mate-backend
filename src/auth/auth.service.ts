import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {
  private client = new OAuth2Client();

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async verifyGoogleToken(idToken: string) {
    try {
      const webClientId = process.env.GG_CLIENT_ID;
      const androidClientId = process.env.GG_ANDROID_CLIENT_ID;

      if (!webClientId || !androidClientId) {
        throw new Error('Missing GG_CLIENT_ID or GG_ANDROID_CLIENT_ID');
      }
      const ticket = await this.client.verifyIdToken({
        idToken,
        audience: [webClientId, androidClientId],
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new Error('Invalid token payload');
      }
      return {
        email: payload.email ?? '',
        name: payload.name ?? '',
        avatar: payload.picture ?? '',
      };
    } catch (error) {
      console.error('🔴 verifyGoogleToken error:', error);
      throw new HttpException(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        `Token verification failed: ${error.message}`,
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async loginWithGoogle(idToken: string) {
    const userInfo = await this.verifyGoogleToken(idToken);

    let user = await this.usersService.findUserByEmail(userInfo.email);
    const baseUsername = userInfo.email.split('@')[0];
    const randomSuffix = Math.floor(Math.random() * 10000);
    const username = `${baseUsername}${randomSuffix}`;

    if (!user) {
      user = await this.usersService.createUser({
        email: userInfo.email,
        name: userInfo.name,
        avatar: userInfo.avatar,
        username,
      });
    }

    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        userName: user.name,
        avatarUrl: user.avatar || '',
        phone: null,
        birthday: null,
        created_at: user.created_at,
      },
    };
  }
}
