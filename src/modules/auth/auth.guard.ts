import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '../../common/services/jwt.service';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/common/decorators';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);

    if (isPublic) return true;

    const request = ctx.switchToHttp().getRequest();
    const token = this.extractTokenFromHeaders(request);

    if (!token) {
      this.logger.warn('Access token is required');
      throw new UnauthorizedException('Access token is required');
    }

    try {
      const tokenPayload = await this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      });

      request['user'] = tokenPayload;
    } catch (error) {
      this.logger.error('Authentication failed', error?.message);
      throw new UnauthorizedException('Authentication failed');
    }
    return true;
  }

  private extractTokenFromHeaders(request: Request) {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
