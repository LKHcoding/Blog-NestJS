import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import dotenv from 'dotenv';
import { HttpExceptionFilter } from './httpException.filter';
import { NestExpressApplication } from '@nestjs/platform-express';
import path from 'path';

declare const module: any;
dotenv.config({
  path:
    process.env.NODE_ENV === 'production'
      ? '.env.production'
      : '.env.development',
});

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('v1');
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

  app.useGlobalFilters(new HttpExceptionFilter());

  app.useStaticAssets(path.join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });

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

  //cors 설정
  var whitelist = ['http://localhost:3030', 'https://www.example.com'];
  app.enableCors(
    // {
    //   origin: function (origin, callback) {
    //     if (whitelist.indexOf(origin) !== -1) {
    //       console.log('allowed cors for:', origin);
    //       callback(null, true);
    //     } else {
    //       console.log('blocked cors for:', origin);
    //       callback(new Error('Not allowed by CORS'));
    //     }
    //   },
    //   allowedHeaders:
    //     'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Observe, application/json, Origin, Authorization, authorization, X-Forwarded-for',
    //   methods: 'GET,PUT,POST,DELETE,UPDATE,OPTIONS',
    //   credentials: true,
    // },
    {
      origin: [
        'http://localhost:3030',
        'http://localhost:3031',
        '211.228.198.23',
      ],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      preflightContinue: false,
      optionsSuccessStatus: 204,
      credentials: true,
    },
  );

  await app.listen(port);
  console.log(`Listening on port ${port}`);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
