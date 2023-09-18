import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser);
  app.enableCors({
    origin: 'http://localhost:8080',
    credentials: true
  });

  const port = 8000;
  await app.listen(port);

  console.log(`App is running on port ${port}`);
}

bootstrap();
