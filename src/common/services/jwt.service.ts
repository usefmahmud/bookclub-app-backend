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

  getTokenOptions(type: 'access' | 'refresh' = 'access') {
    if (type === 'access') {
      return {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRES_IN'),
      };
    }
  }
}
