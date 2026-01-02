import {
  type CallHandler,
  type ExecutionContext,
  Injectable,
  type NestInterceptor,
} from '@nestjs/common';
import type { FastifyReply } from 'fastify';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const COOKIE_NAME = 'auth_token';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: 'none',
  path: '/',
  maxAge: 1000 * 60 * 60 * 24 * 7,
};

type AuthResponse =
  | { token: string }
  | { clearCookie: true }
  | Record<string, unknown>;

@Injectable()
export class SetAuthCookieInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const reply = context.switchToHttp().getResponse<FastifyReply>();

    return next.handle().pipe(
      map((data: AuthResponse) => {
        if ('token' in data && typeof data.token === 'string') {
          reply.setCookie(COOKIE_NAME, data.token, COOKIE_OPTIONS);

          const rest = { ...data };
          delete rest.token;
          return rest;
        }

        if ('clearCookie' in data && data.clearCookie === true) {
          reply.clearCookie(COOKIE_NAME, {
            path: '/',
            httpOnly: true,
            secure: true,
            sameSite: 'none',
          });

          const rest = { ...data };
          delete rest.clearCookie;
          return rest;
        }

        return data;
      }),
    );
  }
}
