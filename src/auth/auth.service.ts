import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

// Services manage the business logic
// They are injected into controllers by Nest.js

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(body: AuthDto): Promise<{ access_token: string }> {
    const { password, email } = body;

    const hash = await argon.hash(password);

    try {
      const user = await this.prisma.user.create({
        data: { email, hash },
        select: { id: true, email: true, createdAt: true },
      });

      // or
      // delete user.hash;

      // return user;

      return await this.signToken(user.id, user.email);
    } catch (err: unknown) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }

      throw err;
    }
  }

  async signin(body: AuthDto): Promise<{ access_token: string }> {
    const { password, email } = body;

    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) throw new UnauthorizedException('Credentials incorrect');

    const pwMatches = await argon.verify(user.hash, password);

    if (!pwMatches) throw new UnauthorizedException('Invalid Credentials');

    // delete user.hash;
    // return user;

    return await this.signToken(user.id, user.email);
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      // sub: jwt convention for unique identifier
      sub: userId,
      email,
    };

    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret,
    });

    return { access_token: token };
  }
}
