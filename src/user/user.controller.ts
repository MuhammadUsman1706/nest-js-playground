import { Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { PrismaService } from 'src/prisma/prisma.service';

// guards are similar to middleware, but they are not dumb, they have info about the next route to be called, which is why good *authorization* to different functionalities
// First, the guard was above the getMe route to protect it. But it is moved to the controller to protect all routes inside it.
@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private prisma: PrismaService) {}

  // /users/me
  @Get('me')
  // we make our own decorator instead of using express one here (@Req() req: Request), to modularize it, in case we need to change that everywhere
  async getMe(@GetUser() user: Omit<User, 'hash'>) {
    // payload returned from validate function in jwt.strategy.ts

    return user;
  }

  @Patch()
  editUser() {}
}
