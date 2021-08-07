import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class NotLoggedInGuard implements CanActivate {
  // 아래와 같은 설정을 통해 토큰을 가져올 경우와 @Public이 붙은 곳의 경로는 공개 경로로 설정.
  constructor() {}

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    // console.log(request.cookies);

    if (request.cookies.Authentication) {
      // jwtAuthGuard에서 인증후에 user정보를 request에 넘겨준다.
      // user정보가 없으면 안됨.
      throw new HttpException(
        '이미 로그인 한 사용자는 접근 할 수 없습니다.',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    return true;
  }
}
