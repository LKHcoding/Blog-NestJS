import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class undefinedToNullInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // 전 부분

    //컨트롤러에서 리턴하는 부분이 여기를 거쳐간다.
    return next
      .handle()
      .pipe(map((data) => (data === undefined ? null : data)));

    // return next
    // .handle()
    // .pipe(map((data) => (data === undefined ? null : data)));
  }
}
