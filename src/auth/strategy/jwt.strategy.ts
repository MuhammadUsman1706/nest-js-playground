import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  // using without private keyword, as to not make it a variable of the class, but just use from param and discard.
  // done when the work of the variable is only in the constructor
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
      ignoreExpiration: false, // by default as well
    });
  }

  async validate(payload: { sub: number; email: string }) {
    // the returned payload gets appended to the user object in the request object
    return { userId: payload.sub, email: payload.email };
  }
}
