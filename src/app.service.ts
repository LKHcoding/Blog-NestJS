import { Injectable } from '@nestjs/common';

// 요청, 응답에 대해서는 모른다.(req, res)
@Injectable()
export class AppService {
  getHello() {
    // return 'Hello World!';
    return process.env.SECRET;
  }
}
