import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET, //protect this, move to env file
    });
  }

  async validate(payload: any) {
    // const user = await this.usersService.getUser(payload.sub)어쩌고 이런 방식으로 가능.
    return {
      id: payload.sub,
      email: payload.email,
      // ...user
    };
  }
}
