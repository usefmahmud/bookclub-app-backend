import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TokenPayload } from '../services/jwt.service';

export const GetCurrentUser = (key?: keyof TokenPayload) =>
  createParamDecorator((_, ctx: ExecutionContext) => {
    const req: {
      user: TokenPayload;
    } = ctx.switchToHttp().getRequest();

    if (key) {
      return req.user[key];
    }

    return req.user;
  });

export const GetCurrentUserId = GetCurrentUser('id');
