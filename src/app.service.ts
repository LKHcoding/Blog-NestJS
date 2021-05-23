import { Injectable } from '@nestjs/common';
import { UsersService } from './users/users.service';
import dotenv from 'dotenv';

dotenv.config();

// DI 개념임
// Providers에 넣어줘야 하는 애들
// 요청, 응답에 대해서는 모른다.(req, res)
@Injectable()
export class AppService {
  constructor(private usersService: UsersService) {}
}
