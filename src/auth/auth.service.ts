import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';

// Services manage the business logic
// They are injected into controllers by Nest.js

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signup(body: AuthDto) {
    const { password, email } = body;

    const hash = await argon.hash(password);

    const user = await this.prisma.user.create({
      data: { email, hash },
      select: { id: true, email: true, createdAt: true },
    });

    // or
    // delete user.hash;

    return user;
  }

  signin() {
    return { message: 'Logged In!' };
  }
}
