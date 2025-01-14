import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UserController {
  // guards are similar to middleware, but they are not dumb, they have info about the next route to be called, which is why good *authorization* to different functionalities
  @UseGuards(AuthGuard('jwt'))
  // /users/me
  @Get('me')
  getMe() {
    return 'user info';
  }
}
