/* eslint-disable prettier/prettier */
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import AllExceptionsFilter from './common/global-filters/all-exceptions.filter';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import * as fs from 'fs';

const httpsOptions = {
  key: fs.readFileSync('./secrets/cert.key'),
  cert: fs.readFileSync('./secrets/cert.crt'),
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { httpsOptions });

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

  await app.listen(process.env.PORT);
}
bootstrap();
