import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService as BaseJwtService } from '@nestjs/jwt';

export interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

@Injectable()
export class JwtService extends BaseJwtService {
  @Inject(ConfigService)
  private readonly configService: ConfigService;

  getToken(payload: TokenPayload): string {
    return this.sign(payload, this.getTokenOptions('access'));
  }

  getRefreshToken(payload: TokenPayload): string {
    return this.sign(payload, this.getTokenOptions('refresh'));
  }

  verifyToken(token: string): TokenPayload {
    try {
      return this.verify(token, this.getTokenOptions('access'));
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  verifyRefreshToken(token: string): TokenPayload {
    try {
      return this.verify(token, this.getTokenOptions('refresh'));
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  getTokenOptions(type: 'access' | 'refresh' = 'access') {
    if (type === 'access') {
      return {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRES_IN'),
      };
    }

    if (type === 'refresh') {
      return {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
      };
    }
  }
}
