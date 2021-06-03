import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'loginID',
      passwordField: 'password',
    });
  }

  async validate(loginID: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(loginID, password);

    // console.log(user);

    if (!user) {
      // throw new UnauthorizedException();
      throw new HttpException('로그인 인증 실패', HttpStatus.UNAUTHORIZED);
    }

    return user;
  }
}
