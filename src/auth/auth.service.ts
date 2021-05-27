import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import dotenv from 'dotenv';
import { CookieOptions } from 'express';

dotenv.config();

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    //비밀번호 받아와서 암호화된 비밀번호랑 비교해야함.
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  // jwt base setting
  async login(user: any) {
    const { id, password, ...payload } = await this.usersService.findByEmail(
      user.email,
    );
    payload['sub'] = user.id;

    // const payload = { email: user.email, sub: user.id };

    //이전 로직에서는 Access Token을 그대로 반환했지만 토큰만을 반환하여 cookie에 저장해야합니다.
    const token = this.jwtService.sign(payload);

    const options: CookieOptions = {
      // domain: 'localhost', // 하위 도메인을 제외한 도메인이 일치하는 경우에만 쿠키 설정. defalt: loaded
      path: '/', // 경로. 주어진 경로의 하위 디렉토리에 있는 경우에만 쿠키 설정. defalt: '/' 는 전체.
      httpOnly: true, // http에서만 쿠키활용 가능. defalt: true
      maxAge: Number(process.env.COOKIE_MAX_AGE) * 24 * 60 * 1000,
      // maxAge : 60 * 1000 = 60000 = 60초 // 쿠키가 만료되는 시간. 밀리초 단위. 0으로 설정하면 쿠키가 지워진다.
      // expires: null, // 쿠키의 만료 시간을 표준 시간으로 설정
      // signed: , // 쿠키의 서명 여부
      // secure: true, // 주소가 "https"로 시작하는 경우에만 쿠키 생성
      sameSite: 'none', // 서로 다른 도메인간의 쿠키 전송에 대한 보안을 설정. defalt: "Lax"
      // "Strict" : 서로 다른 도메인에서 아예 전송 불가능. 보안성은 높으나 편의가 낮다.
      // "Lax" : 서로 다른 도메인이지만 일부 예외( HTTP get method / a href / link href )에서는 전송 가능.
      // "None" : 모든 도메인에서 전송 가능
      // 좀더 자세히는 https://web.dev/samesite-cookies-explained/
    };
    return { token, options };
  }

  async logOut() {
    const token = '';
    const options: CookieOptions = {
      // domain: 'localhost',
      path: '/',
      httpOnly: true,
      maxAge: 0,
      // secure: true,
      // sameSite: 'strict',
    };
    return { token, options };
  }
}
