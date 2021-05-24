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
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      maxAge: Number(process.env.COOKIE_MAX_AGE) * 24 * 60 * 1000,
      secure: true,
      sameSite: 'strict',
    };
    return { token, options };
  }

  async logOut() {
    const token = '';
    const options: CookieOptions = {
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      maxAge: 0,
      secure: true,
      sameSite: 'strict',
    };
    return { token, options };
  }
}
