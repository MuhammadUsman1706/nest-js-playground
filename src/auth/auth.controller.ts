import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {
    // console.log('Instance created!');
  }

  @Post('signup')
  // never use @Req() req: Request, it is express focused, not Nest js. It will be difficult for you to move to other underlying framework like fastify, or some other in future.
  // @Body() means it is Nest's headache to parse the body
  signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto);
  }

  @Post('signin')
  signin(@Body() dto: AuthDto) {
    return this.authService.signin(dto);
  }
}

// pipes are executed just before a method is invoked, it has two purpose data validation and transformation
