import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('users')
export class UserController {
  constructor(private prisma: PrismaService) {}

  // guards are similar to middleware, but they are not dumb, they have info about the next route to be called, which is why good *authorization* to different functionalities
  @UseGuards(AuthGuard('jwt'))
  // /users/me
  @Get('me')
  async getMe(@Req() req: Request) {
    // payload returned from validate in jwt.strategy.ts

    // NOT IN COURSE, TO VALIDATE
    const payload = req.user as { userId: number; email: string };

    const user = await this.prisma.user.findUnique({
      where: { id: payload.userId },
    });

    delete user.hash;

    return user;
  }
}
