import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Response,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiCookieAuth, ApiOperation } from '@nestjs/swagger';
import { AppService } from './app.service';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthenticatedGuard } from './auth/authenticated.guard';

// req, res에 대해 알고있는 영역
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: '로그인' })
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return { msg: 'Logged in!' };
  }

  @UseGuards(AuthenticatedGuard)
  @Get('protected')
  protected(@Request() req): string {
    return req.user;
  }

  @ApiCookieAuth('connect.sid')
  @ApiOperation({ summary: '로그아웃' })
  @UseGuards(AuthenticatedGuard)
  @Post('logout')
  async logout(@Response() res) {
    res.clearCookie('connect.sid', { httpOnly: true });
    return res.send('ok');
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
