import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/client';

type PayloadUser = Omit<User, 'hash'>;

export const GetUser = createParamDecorator(
  (data: keyof PayloadUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: PayloadUser = request.user;

    if (data) return user[data];

    return request.user as PayloadUser;
  },
);
