import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

// Services manage the business logic
// They are injected into controllers by Nest.js

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signup(body: AuthDto) {
    const { password, email } = body;

    const hash = await argon.hash(password);

    try {
      const user = await this.prisma.user.create({
        data: { email, hash },
        select: { id: true, email: true, createdAt: true },
      });

      // or
      // delete user.hash;

      return user;
    } catch (err: unknown) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }

      throw err;
    }
  }

  async signin(body: AuthDto) {
    const { password, email } = body;

    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) throw new UnauthorizedException('Credentials incorrect');

    const pwMatches = await argon.verify(user.hash, password);

    if (!pwMatches) throw new UnauthorizedException('Invalid Credentials');

    delete user.hash;

    return user;
  }
}
