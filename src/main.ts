import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './transform.interceptor';
import { Logger } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
// import * as dotenv from 'dotenv';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);

  const config = app.get<ConfigService>(ConfigService);
  const appPort = config.get('APP_PORT');

  const corsOrigins = process.env.CORS_ORIGINS.split(',');
  app.enableCors({
    origin: corsOrigins, // Add more sites as needed
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalInterceptors(new TransformInterceptor());
  await app.listen(appPort);
  logger.log(`Server running on port ${appPort}`);
}
bootstrap();
