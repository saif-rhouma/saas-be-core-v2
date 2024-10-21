/* eslint-disable prettier/prettier */
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import AllExceptionsFilter from './common/global-filters/all-exceptions.filter';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Getting the Winston logger
  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  const httpAdapterHost = app.get(HttpAdapterHost);

  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      // forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost, logger));
  app.setGlobalPrefix('api');
  await app.listen(3000);
}
bootstrap();
