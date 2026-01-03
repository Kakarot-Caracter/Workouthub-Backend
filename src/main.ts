import fastifyCookie from '@fastify/cookie';
import fastifyCors from '@fastify/cors';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  type NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { PrismaClientExceptionFilter } from './common/filters/prisma-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      trustProxy: true, // Para manejar proxies (Vercel, Koyeb)
      logger: true, // Para debug
    }),
  );

  // Cookies firmadas opcionalmente
  await app.register(fastifyCookie, {
    secret: process.env.COOKIE_SECRET || 'supersecret',
  });

  app.setGlobalPrefix('api/v1');

  app.useGlobalFilters(new PrismaClientExceptionFilter());

  await app.register(fastifyCors, {
    origin: [
      'https://workouthub-frontend.vercel.app',
      process.env.FRONTEND_DEV_URL ?? 'http://localhost:5173',
      'http://localhost:3000',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
    ],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Workouthub Documentacion')
    .setDescription('Workouthub es una api para gestionar entrenamientos')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen({
    port: Number(process.env.PORT ?? 3001),
    host: '0.0.0.0',
  });
}

bootstrap();
