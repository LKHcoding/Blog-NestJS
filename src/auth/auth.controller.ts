import {
  Controller,
  Get,
  Post,
  Res,
  UseGuards,
  Request,
  Body,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

import { Response } from 'express';
import { AuthLoginRequestDto } from './dto/auth-login.request.dto';
import { Role } from 'src/common/decorators/role.decorator';
import { UserRole } from 'src/entities/Users';
import { RolesGuard } from './roles.guard';
import { Auth } from 'src/common/decorators/auth.decorator';
import { NotLoggedInGuard } from './not-logged-in.guard';
import { GithubCodeDto } from 'src/common/dto/user.dto';
import { UsersService } from 'src/users/users.service';

// req, res에 대해 알고있는 영역
@ApiTags('AUTH')
@Controller('auth')
export class AuthController {
  // AuthService의 login 함수를 사용하기 위하여 constructor에 선언해 줘야 합니다.
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: '로그인' })
  @ApiResponse({
    status: 201,
    description: 'login 성공',
  })
  @ApiBody({
    type: AuthLoginRequestDto,
  })
  @UseGuards(LocalAuthGuard, NotLoggedInGuard)
  @Post('login')
  async login(@Request() req, @Res({ passthrough: true }) res: Response) {
    const { token, options } = await this.authService.login(req.user);
    // 반환된 Token 값을 쿠키에 저장합니다.
    // 저장하기 위하여 res가 필요합니다.
    //토큰을 쿠키에 등록해주기(express)
    // res.cookie('Authentication', token, options);
    // res.send('login 성공');
    // console.log('로그인성공 token : ', token);
    return { token };
  }

  @ApiOperation({ summary: 'Swaggar 전용 Login' })
  @ApiResponse({
    status: 201,
    description: 'login 성공',
  })
  @ApiBody({
    type: AuthLoginRequestDto,
  })
  @UseGuards(LocalAuthGuard, NotLoggedInGuard)
  @Post('swaggarLogin')
  async swaggarLogin(
    @Request() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { token, options } = await this.authService.login(req.user);
    // 반환된 Token 값을 쿠키에 저장합니다.
    // 저장하기 위하여 res가 필요합니다.
    //토큰을 쿠키에 등록해주기(express)
    res.cookie('Authentication', token, options);
    res.send('login 성공');
    // console.log('로그인성공 token : ', token);
    // return { token };
  }

  @ApiCookieAuth('Authentication')
  @Auth(UserRole.User)
  @Get('protected')
  protected(@Request() req): string {
    return req.user;
  }

  @ApiCookieAuth('Authentication')
  @ApiOperation({ summary: '로그아웃' })
  @ApiResponse({
    status: 201,
    description: 'logout 성공',
  })
  @Auth(UserRole.User)
  @Post('logout')
  async logOut(@Res({ passthrough: true }) res: Response) {
    // passthrough 설명 참고 사이트
    //https://min-ki.github.io/TIL/nestjs-controllers
    // const { token, options } = await this.authService.logOut();
    // 쿠키 날리는 방식 2
    //   res.clearCookie('Authentication', { httpOnly: true });
    // res.cookie('Authentication', token, options);
    // res.send('logout 성공');
    return { data: 'logout 성공' };
  }

  @Post('github-info')
  async getGithubInfo(@Body() githubCodeDto: GithubCodeDto) {
    console.log(githubCodeDto);
    const user = await this.authService.getGithubInfo(githubCodeDto);

    return {
      status: 200,
      message: '깃허브 유저 정보를 조회하였습니다.',
      data: {
        user,
      },
    };
  }
}
