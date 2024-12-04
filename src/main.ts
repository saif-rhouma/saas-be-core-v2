/* eslint-disable prettier/prettier */
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import AllExceptionsFilter from './common/global-filters/all-exceptions.filter';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import * as morgan from 'morgan';
// import * as fs from 'fs';

// const httpsOptions = {
//   key: fs.readFileSync('./secrets/cert.key'),
//   cert: fs.readFileSync('./secrets/cert.crt'),
// };

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  // Getting the Winston logger
  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  const httpAdapterHost = app.get(HttpAdapterHost);

  // app.enableCors({
  //   origin: [
  //     'http://localhost:3030',
  //     'http://nidhal.site',
  //     'http://www.nidhal.site',
  //     'http://backend.nidhal.site',
  //     'https://nidhal.site',
  //     'https://www.nidhal.site',
  //     'https://backend.nidhal.site',
  //     '*',
  //   ],
  //   methods: 'GET,POST,PUT,DELETE', // Allowed methods
  //   allowedHeaders: 'Content-Type, Authorization', // Allowed headers
  //   credentials: true,
  // });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      // forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost, logger));
  app.setGlobalPrefix('api');

  app.use(morgan('tiny'));

  await app.listen(process.env.PORT);
  console.log(`Server is Running on PORT ${process.env.PORT}`);
}
bootstrap();
