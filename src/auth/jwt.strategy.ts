import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import dotenv from 'dotenv';
import { UsersService } from 'src/users/users.service';
import { Injectable } from '@nestjs/common';

dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    /**
     * jwtFromRequest : JWT 추출 방법을 제공합니다. Request의 Authorization 헤더에 토큰을 제공하는 방식입니다.
     * ignoreExpiration : false라면 JWT가 만료되었는지 확인하고 만료되었다면 401 예외를 발생합니다.
     * secretOrKey : 다칭키를 제공하는 옵션입니다.
     */
    super({
      // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET, //protect this with env file
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          return request?.cookies?.Authentication;
        },
      ]),
    });
  }

  async validate(payload: any) {
    // 이런 방식으로 유저정보 토큰에 같이 보낼수 있음.
    const { password, ...user } = await this.usersService.findById(payload.sub);

    return {
      // id: payload.sub,
      // email: payload.email,
      ...user,
    };
  }
}
