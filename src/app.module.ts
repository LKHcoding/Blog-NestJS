import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import * as ormconfig from '../ormconfig';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(ormconfig),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  // 전역 가드를 사용하여 전체 controller에 가드가 적용되어 Header인증 없이는 접속이 불가능 합니다.
  // providers: [AppService, { provide: APP_GUARD, useClass: JwtAuthGuard }],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    // Logger 설정하는 미들웨어 apply
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
