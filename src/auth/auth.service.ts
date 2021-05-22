import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOneUser(email);

    //비밀번호 받아와서 암호화된 비밀번호랑 비교해야함.
    // console.log('AuthService', await bcrypt.compare(password, user.password));

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  // jwt base setting
  async login(user: any) {
    const payload = { email: user.email, sub: user.id };

    return {
      acces_token: this.jwtService.sign(payload),
    };
  }
}
