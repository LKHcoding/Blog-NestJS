import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// jwt 쓰는사람들은 컨트롤러에서 req, res 안쓰고 @Token() token 이렇게 갖다쓸수있음.
export const Token = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    /**
     * ctx를 찍어보면 뭔지 알것.
     * nest를 할때 http만 되는게 아니라, websocket이랑 rpc서버랑 http서버를
     * 동시에 돌릴 수도 있다.
     * 그것들을 하나의 실행 컨텍스트안에서 관리하고,
     * 그 중에서 http정보 가져오는 것.
     */
    const response = ctx.switchToHttp().getResponse();
    return response.locals.jwt;
  },
);
// 컨트롤러에서 req, res 안쓰고 데코레이터를 따로 만들어서 쓰는 이유는
// 혹시나 express 에서 fastify나 koa로 넘어갈 경우 decorator만 수정하면되고,
// 중복코드를 제거하는 목적
