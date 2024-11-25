import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
// import { TransformInterceptor } from './transform.interceptor';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

import { ConfigService } from '@nestjs/config';
import { useContainer } from 'class-validator';
// import * as dotenv from 'dotenv';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);

  const config = app.get<ConfigService>(ConfigService);
  const appPort = config.get('APP_PORT');

  const corsOrigins = process.env.CORS_ORIGINS.split(',');

  app.enableCors({
    origin: corsOrigins, // Add more sites as needed
    // methods: 'GET,POST,PUT,DELETE',
    // allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });
  app.use(cookieParser()); // Use cookie-parser middleware

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  /*
  TODO
  */
  // app.useGlobalInterceptors(new TransformInterceptor());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(appPort);
  logger.log(`Server running on port ${appPort}`);
}
bootstrap();
