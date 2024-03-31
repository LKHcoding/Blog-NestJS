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
import { UserRole, Users } from 'src/entities/Users';
import { RolesGuard } from './roles.guard';
import { Auth } from 'src/common/decorators/auth.decorator';
import { NotLoggedInGuard } from './not-logged-in.guard';
import { GithubCodeDto } from 'src/common/dto/github-code.dto';
import { UsersService } from 'src/users/users.service';
import { UserDto } from 'src/common/dto/user.dto';
import { GithubSignUpDto } from 'src/common/dto/github-signup.dto';

// req, res에 대해 알고있는 영역
@ApiTags('AUTH')
@Controller('auth')
export class AuthController {
  // AuthService의 login 함수를 사용하기 위하여 constructor에 선언해 줘야 합니다.
  constructor(
    private readonly authService: AuthService,
    private userService: UsersService,
  ) {}

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
  async login(
    @Request() req,
    @Res({ passthrough: true }) res: Response,
    @Body() body: AuthLoginRequestDto,
  ) {
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
    @Body() body: AuthLoginRequestDto,
  ) {
    // console.log('this is body : ', body);
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

  @UseGuards(NotLoggedInGuard)
  @Post('github-info')
  async getGithubInfo(@Body() githubCodeDto: GithubCodeDto) {
    console.log('-> githubCodeDto', githubCodeDto);
    // 깃허브 유저 정보 가져오는 곳
    const user = await this.authService.getGithubInfo(githubCodeDto);

    // 깃허브 유저 정보로 회원가입 여부를 가져오는 곳(true는 가입된유저)
    const isSignUpUser = await this.userService.findByGithubID(user.githubID);

    if (isSignUpUser === false) {
      return {
        status: 200,
        message: '아직 가입되지 않은 유저입니다.',
        githubUserData: user,
        isSignUpUser,
      };
    }

    //토큰 만들기 전 타입 변환
    const convertedUser: UserDto = {
      id: isSignUpUser.id,
      role: isSignUpUser.role,
      loginType: isSignUpUser.loginType,
      githubID: isSignUpUser.githubID,
      loginID: isSignUpUser.loginID,
      email: isSignUpUser.email,
      nickname: isSignUpUser.nickname,
      positionType: isSignUpUser.positionType,
      blog: isSignUpUser.blog,
      bio: isSignUpUser.bio,
      avatarUrl: isSignUpUser.avatarUrl,
      githubPageUrl: isSignUpUser.githubPageUrl,
      createdAt: isSignUpUser.createdAt.toString(),
      updatedAt: isSignUpUser.updatedAt.toString(),
      deletedAt: isSignUpUser.deletedAt?.toString(),
    };

    const { token, options } = await this.authService.login(convertedUser);

    return {
      status: 200,
      message: '깃허브 유저 정보를 조회하였습니다.',
      githubUserData: user,
      token,
    };
  }

  @UseGuards(NotLoggedInGuard)
  @Post('github-signup')
  async getGithubSignUp(@Body() githubSignUpDto: GithubSignUpDto) {
    // console.log(githubSignUpDto);
    //회원가입 시켜야 할지 말지 처리하는곳
    const githubUserResult =
      await this.userService.githubSignUpUser(githubSignUpDto);

    //토큰 만들기 전 타입 변환
    const convertedUser: UserDto = {
      id: githubUserResult.id,
      role: githubUserResult.role,
      loginType: githubUserResult.loginType,
      githubID: githubUserResult.githubID,
      loginID: githubUserResult.loginID,
      email: githubUserResult.email,
      nickname: githubUserResult.nickname,
      positionType: githubUserResult.positionType,
      blog: githubUserResult.blog,
      bio: githubUserResult.bio,
      avatarUrl: githubUserResult.avatarUrl,
      githubPageUrl: githubUserResult.githubPageUrl,
      createdAt: githubUserResult.createdAt.toString(),
      updatedAt: githubUserResult.updatedAt.toString(),
      deletedAt: githubUserResult.deletedAt?.toString(),
    };

    const { token, options } = await this.authService.login(convertedUser);

    return {
      status: 200,
      message: '깃허브 회원가입 성공 및 유저 정보를 조회하였습니다.',
      user: convertedUser,
      token,
    };
  }
}
