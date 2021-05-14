import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  getUser() {}
  postUsers(email: string, nickname: string, password: string) {}
}
