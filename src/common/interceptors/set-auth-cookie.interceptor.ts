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

const isProduction = process.env.NODE_ENV === 'production';

// ✅ Opciones de cookie dinámicas según el entorno
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? ('none' as const) : ('lax' as const),
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días en milisegundos
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
