import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCookieAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { NotLoggedInGuard } from 'src/auth/not-logged-in.guard';
import { Auth } from 'src/common/decorators/auth.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { UserDto } from 'src/common/dto/user.dto';
import { UserRole } from 'src/entities/Users';
import { LocalSignUpRequestDto } from './dto/local-sign-up.request.dto';
import { UsersService } from './users.service';

@ApiTags('USER')
@Controller('users')
export class UsersController {
  // 컨트롤러에서도 req, res같은걸 최대한 안쓰는게 좋다.
  // nest.js를 쓰더라도 express가 아닌 fastify 같은걸로 바꾸게 될경우,
  // express라는 특정한 플랫폼에 맞게 작성된 코드들을 모두 수정해줘야 하니까

  constructor(private userService: UsersService) {}

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
  @Auth(UserRole.Admin)
  @ApiOperation({ summary: '유저 전체 조회' })
  @ApiResponse({
    status: 200,
    description: '성공',
    type: [UserDto],
  })
  @Get('/all')
  async findAll(
    @Query('page') page: string,
    @Query('perPage') perPage: string,
  ) {
    //query 변수에 쿼리스트링으로 넘어온 값들이 들어온다.
    // 이걸 이용해서 select시 페이징 처리하여 리턴 할 수 있다.
    // 아직 하진 않았음.
    // throw new HttpException('권한이 없습니다.1', HttpStatus.UNAUTHORIZED);

    return await this.userService.findAll();
  }

  @ApiOperation({ summary: '특정 유저 조회' })
  @ApiParam({
    name: 'loginID',
    required: true,
    description: '찾을 사용자 아이디',
  })
  @ApiResponse({
    status: 200,
    description: '성공',
    type: UserDto,
  })
  @ApiNotFoundResponse({ description: '해당 유저가 존재하지 않습니다' })
  @Get('/:loginID')
  async getOneUser(@Query() query, @Param('loginID') loginID: string) {
    // const user = await this.usersRepository.findOne({ where: { email } });
    // console.log('this is getOneUser', param.loginID);
    // const { password, ...userdata } = await this.userService.findById(param.id);
    const { password, ...userdata } = await this.userService.findByLoginID(
      loginID,
    );
    return userdata;
  }

  // @ApiBearerAuth('Authentication')
  @ApiCookieAuth('Authentication')
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
  @Auth(UserRole.User)
  @Get()
  getUsers(@User() user: UserDto) {
    return user;
  }

  @ApiOperation({ summary: 'Local 회원가입' })
  @ApiBody({
    type: LocalSignUpRequestDto,
  })
  @UseGuards(NotLoggedInGuard)
  @Post()
  async postUsers(@Body() signUpUserData: LocalSignUpRequestDto) {
    // DTO : data transfer object 약자로, 데이터를 전달하는 오브젝트
    // @Body() -> express의 bodyParser 같은 역할
    const result = this.userService.postUsers(signUpUserData);
    return result;
  }
}
