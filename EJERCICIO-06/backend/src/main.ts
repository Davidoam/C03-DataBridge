import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(Number(process.env.PORT ?? 3000), '0.0.0.0');
}

void bootstrap();

