import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = 400;
    let message = 'Error de base de datos';

    switch (exception.code) {
      case 'P2002': // Unique constraint failed
        status = 400;
        const fields = Array.isArray(exception.meta?.target)
          ? exception.meta.target.join(', ')
          : '';

        message = `El campo ${fields} ya está en uso.`;
        break;
      case 'P2025': // Record not found
        status = 404;
        message = 'Registro no encontrado.';
        break;
      default:
        status = 400;
        message = 'Error conocido de base de datos.';
    }

    response.status(status).json({ statusCode: status, message });
  }
}
