import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import type { FastifyReply } from 'fastify';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const COOKIE_NAME = 'auth_token';

// ✅ Opciones de cookie correctas para cross-site
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true, // HTTPS obligatorio
  sameSite: 'none' as const, // cross-site
  path: '/',
  maxAge: 7 * 24 * 60 * 60, // 7 días en segundos
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
        // ⚡ Si hay token, setea cookie
        if ('token' in data && typeof data.token === 'string') {
          reply.setCookie(COOKIE_NAME, data.token, COOKIE_OPTIONS);

          const rest = { ...data };
          delete rest.token;
          return rest;
        }

        // ⚡ Si hay clearCookie, borra cookie con las mismas opciones
        if ('clearCookie' in data && data.clearCookie === true) {
          reply.clearCookie(COOKIE_NAME, COOKIE_OPTIONS);

          const rest = { ...data };
          delete rest.clearCookie;
          return rest;
        }

        return data;
      }),
    );
  }
}
