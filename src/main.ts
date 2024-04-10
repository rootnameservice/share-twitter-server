import { NestFactory } from '@nestjs/core';
import { AppModule } from './module/app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: [process.env.APP_ENDPOINT],
    credentials: true,
  });
  await app.listen(3001);
}
bootstrap();
