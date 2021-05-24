import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from 'src/common/decorators/skip-auth.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { UserDto } from 'src/common/dto/user.dto';
import { JoinRequestDto } from './dto/join.request.dto';
import { UsersService } from './users.service';

@ApiTags('USER')
@Controller('api/users')
export class UsersController {
  // 컨트롤러에서도 req, res같은걸 최대한 안쓰는게 좋다.
  // nest.js를 쓰더라도 express가 아닌 fastify 같은걸로 바꾸게 될경우,
  // express라는 특정한 플랫폼에 맞게 작성된 코드들을 모두 수정해줘야 하니까

  constructor(private userService: UsersService) {}

  @ApiOperation({ summary: '특정 유저 조회' })
  @ApiParam({
    name: 'id',
    required: true,
    description: '찾을 사용자 아이디',
  })
  @ApiNotFoundResponse({ description: '해당 id가 존재하지 않습니다' })
  @Get('all/:id')
  findById(@Query() query, @Param() param) {
    // const user = await this.usersRepository.findOne({ where: { email } });
    return this.userService.findById(param.id);
  }

  @ApiQuery({
    name: 'perPage',
    required: true,
    description: '한번에 가져오는 개수',
  })
  @ApiQuery({
    name: 'page',
    required: true,
    description: '불러올 페이지',
  })
  @ApiOperation({ summary: '유저 전체 조회' })
  @Get('all')
  findAll(@Query() query) {
    //query 변수에 쿼리스트링으로 넘어온 값들이 들어온다.
    // 이걸 이용해서 select시 페이징 처리하여 리턴 할 수 있다.
    // 아직 하진 않았음.
    return this.userService.findAll();
  }

  @ApiResponse({
    status: 200,
    description: '성공',
    type: UserDto,
  })
  @ApiResponse({
    status: 500,
    description: '서버 에러',
  })
  @ApiOperation({ summary: '내 정보 조회' })
  @Get()
  getUsers(@User() user) {
    return user;
  }

  @ApiOperation({ summary: '회원가입' })
  @Public()
  @Post()
  postUsers(@Body() data: JoinRequestDto) {
    // DTO : data transfer object 약자로, 데이터를 전달하는 오브젝트
    // @Body() -> express의 bodyParser 같은 역할
    const result = this.userService.postUsers(
      data.email,
      data.nickname,
      data.password,
    );
    return result;
  }

  // @ApiResponse({
  //   status: 200,
  //   description: '성공',
  //   type: UserDto,
  // })
  // @ApiOperation({ summary: '로그인' })
  // @Post('login')
  // logIn(@User() user) {
  //   return user;
  // }

  // @ApiOperation({ summary: '로그아웃' })
  // @Post('logout')
  // logOut(@Req() req, @Res() res) {
  //   req.logOut();
  //   res.clearCookie('connect.sid', { httpOnly: true });
  //   res.send('ok');
  // }
}
