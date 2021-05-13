import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { JoinRequestDto } from './dto/join.request.dto';
import { UsersService } from './users.service';

@Controller('api/users')
export class UsersController {
  // 컨트롤러에서도 req, res같은걸 최대한 안쓰는게 좋다.
  // nest.js를 쓰더라도 express가 아닌 fastify 같은걸로 바꾸게 될경우,
  // express라는 특정한 플랫폼에 맞게 작성된 코드들을 모두 수정해줘야 하니까

  constructor(private userService: UsersService) {}

  @Get()
  getUsers(@Req() req) {
    return req.user;
  }

  @Post()
  postUsers(@Body() data: JoinRequestDto) {
    // DTO : data transfer object 약자로, 데이터를 전달하는 오브젝트
    // @Body() -> express의 bodyparser 같은 역할
    this.userService.postUsers(data.email, data.nickname, data.password);
  }

  @Post('login')
  logIn(@Req() req) {
    return req.user;
  }

  @Post('logout')
  logOut(@Req() req, @Res() res) {
    req.logOut();
    res.clearCookie('connect.sid', { httpOnly: true });
    res.send('ok');
  }
}
