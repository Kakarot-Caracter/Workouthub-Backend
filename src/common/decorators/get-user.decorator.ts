import {
  createParamDecorator,
  type ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import type { User } from '@prisma/client';

interface RequestWithUser {
  user?: User;
}

export const GetUser = createParamDecorator(
  <K extends keyof User>(
    data: K | undefined,
    ctx: ExecutionContext,
  ): User | User[K] => {
    const req = ctx.switchToHttp().getRequest<RequestWithUser>();
    const user = req.user;

    if (!user) {
      throw new InternalServerErrorException('User not found');
    }

    if (!data) return user;

    return user[data];
  },
);
