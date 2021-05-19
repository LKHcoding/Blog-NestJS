import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(email: string, pass: string): Promise<any> {
    //비밀번호 받아와서 암호화 한다음에 비교해야함
    const hashedPassword = await bcrypt.hash(pass, 12);

    const user = await this.usersService.findOneUser(email);

    if (user && user.password === hashedPassword) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }
}
