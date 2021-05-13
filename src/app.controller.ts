import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

// req, res에 대해 알고있는 영역
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
