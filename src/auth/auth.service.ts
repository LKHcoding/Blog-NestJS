import { HttpException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import dotenv from 'dotenv';
import { CookieOptions } from 'express';
import axios from 'axios';
import { GithubCodeDto } from 'src/common/dto/github-code.dto';
import { UserDto } from 'src/common/dto/user.dto';
import { IsNumber, IsString } from 'class-validator';
import { GithubUserInfoDTO } from 'src/common/dto/github-user-info.dto';

dotenv.config({
  path:
    process.env.NODE_ENV === 'production'
      ? '.env.production'
      : '.env.development',
});

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(loginID: string, password: string): Promise<any> {
    const user = await this.usersService.findByLoginID(loginID);

    //비밀번호 받아와서 암호화된 비밀번호랑 비교해야함.
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  // jwt base setting
  async login(user: UserDto) {
    // const { password, ...payload } = await this.usersService.findByLoginID(
    //   user.loginID,
    // );
    // console.log('this is login user : ', user);

    // 토큰을 만들어서 프론트단에서 쿠키에 저장한다.
    const token = this.jwtService.sign(user);

    const options: CookieOptions = {
      domain: process.env.DOMAIN, // 하위 도메인을 제외한 도메인이 일치하는 경우에만 쿠키 설정. defalt: loaded
      path: '/', // 경로. 주어진 경로의 하위 디렉토리에 있는 경우에만 쿠키 설정. defalt: '/' 는 전체.
      httpOnly: true, // http에서만 쿠키활용 가능. defalt: true
      maxAge: Number(process.env.COOKIE_MAX_AGE) * 24 * 60 * 1000,
      // maxAge : 60 * 1000 = 60000 = 60초 // 쿠키가 만료되는 시간. 밀리초 단위. 0으로 설정하면 쿠키가 지워진다.
      // expires: null, // 쿠키의 만료 시간을 표준 시간으로 설정
      // signed: , // 쿠키의 서명 여부
      // secure: true, // 주소가 "https"로 시작하는 경우에만 쿠키 생성
      sameSite: 'strict', // 서로 다른 도메인간의 쿠키 전송에 대한 보안을 설정. defalt: "Lax"
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

  //github 유저 인증하는곳
  async getGithubInfo(githubCodeDto: GithubCodeDto) {
    // 웹에서 query string으로 받은 code를 서버로 넘겨 받습니다.
    const { code } = githubCodeDto;

    // 깃허브 access token을 얻기 위한 요청 api 주소
    const getTokenUrl: string = 'https://github.com/login/oauth/access_token';

    // Body에는 Client ID, Client Secret,
    // 웹에서 query string으로 받은 code를 넣어서 전달해주어야함
    const request = {
      code,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
    };

    const result = await axios
      .post(getTokenUrl, request, {
        headers: {
          accept: 'application/json', // json으로 반환을 요청합니다.
        },
      })
      .then((res) => res.data)
      .catch((err) => console.log(err.message));

    if (!result) {
      // 데이터가 없고 에러발생한경우
      throw new HttpException('깃허브 인증을 실패했습니다.', 401);
    }

    // 요청이 성공한다면, access_token 키값의 토큰을 깃허브에서 넘겨줍니다.
    const { access_token } = result;

    // 깃허브 유저 조회 api 주소
    const getUserUrl: string = 'https://api.github.com/user';

    const { data } = await axios.get(getUserUrl, {
      // 헤더에는 `token ${access_token}` 형식으로 넣어주어야 함
      headers: {
        Authorization: `token ${access_token}`,
      },
    });

    // 깃허브 유저 조회 api에서 받은 데이터들을 골라서 처리해줍니다.
    const { id, node_id, login, email, name, blog, bio, avatar_url, html_url } =
      data;

    const githubInfo: GithubUserInfoDTO = {
      githubID: id,
      nodeID: node_id || '',
      loginID: login,
      email: email || '',
      name: name || '',
      blog: blog || '',
      bio: bio || '',
      avatarUrl: avatar_url || '',
      githubPageUrl: html_url || '',
    };

    return githubInfo;
  }
}
