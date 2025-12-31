import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { FastifyReply } from 'fastify';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();

    let status = HttpStatus.BAD_REQUEST;
    let message = 'Error de base de datos';

    switch (exception.code) {
      case 'P2002': {
        status = HttpStatus.CONFLICT;
        const fields = Array.isArray(exception.meta?.target)
          ? exception.meta.target.join(', ')
          : '';
        message = `El campo ${fields} ya está en uso.`;
        break;
      }

      case 'P2025':
        status = HttpStatus.NOT_FOUND;
        message = 'Registro no encontrado.';
        break;

      default:
        status = HttpStatus.BAD_REQUEST;
        message = 'Error conocido de base de datos.';
    }

    response.status(status).send({
      statusCode: status,
      message,
    });
  }
}
