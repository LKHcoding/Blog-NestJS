import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const err = exception.getResponse() as
      | string // 내가 만든 익셉션
      | { error: string; statusCode: 400; message: string[] } // class-validator 타입
      | { statusCode: 400; message: string }; // Unauthorized 타입

    console.log(
      '-------------------------------------------------------------',
    );
    console.log('Exception statusCode : ', status);
    console.log('Exception Error : ', err);
    console.log(
      '-------------------------------------------------------------',
    );

    // class-validator exception
    if (
      typeof err !== 'string' &&
      'error' in err &&
      err.error === 'Bad Request'
    ) {
      return response.status(status).json({
        success: false,
        statusCode: status,
        message: err.message,
      });
    }

    // Unauthorized exception
    if (typeof err !== 'string' && err.message === 'Unauthorized') {
      return response.status(status).json({
        success: false,
        statusCode: status,
        message: '인증 되지 않은 유저입니다.',
      });
    }

    // custom exception
    response.status(status).json({
      success: false,
      statusCode: status,
      message: err,
    });
  }
}
