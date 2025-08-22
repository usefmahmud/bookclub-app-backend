import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService as BaseJwtService } from '@nestjs/jwt';

interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

@Injectable()
export class JwtService extends BaseJwtService {
  @Inject(ConfigService)
  private readonly configService: ConfigService;

  getToken(payload: TokenPayload): string {
    return this.sign(payload, this.getTokenOptions());
  }

  verifyToken(token: string) {
    try {
      return this.verify(token, this.getTokenOptions());
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  getRefreshToken(payload: TokenPayload): string {
    return this.sign(payload, this.getTokenOptions('refresh'));
  }

  verifyRefreshToken(token: string) {
    try {
      return this.verify(token, this.getTokenOptions('refresh'));
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  getTokenOptions(type: 'access' | 'refresh' = 'access') {
    if (type === 'access') {
      return {
        secret:
          this.configService.get<string>('JWT_ACCESS_SECRET') ||
          'default-access-secret',
        expiresIn:
          this.configService.get<string>('JWT_ACCESS_EXPIRES_IN') || '15m',
      };
    } else if (type === 'refresh') {
      return {
        secret:
          this.configService.get<string>('JWT_REFRESH_SECRET') ||
          'default-refresh-secret',
        expiresIn:
          this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '7d',
      };
    }
  }
}
