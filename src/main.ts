import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import dotenv from 'dotenv';

declare const module: any;
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;
  app.use(cookieParser());

  // class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //dto 정의된 타입외 값은 허용하지 않는다.
      forbidNonWhitelisted: true, //정해진 필드가 아닌 경우 에러를 보낸다.
      transform: true, //데이터를 받아서 넘겨줄때 자동으로 타입을 변환해준다.
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Blog nestjs API')
    .setDescription('Blog 개발을 위한 nestjs api 문서입니다')
    .setVersion('1.0')
    .addCookieAuth('Authentication')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'method',
      // operationsSorter: 'alpha',
      // defaultModelsExpandDepth: -1,
    },
  });

  await app.listen(port);
  console.log(`Listening on port ${port}`);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
