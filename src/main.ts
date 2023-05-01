import { ConfigService } from '@nestjs/config';
import { NestApplication, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestApplication>(AppModule);
  const config = app.get(ConfigService);
  app.enableCors();
  const port = config.get('PORT');
  await app.listen(port);
}
bootstrap();
