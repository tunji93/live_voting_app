import { ConfigService } from '@nestjs/config';
import { NestApplication, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SocketIOAdapter } from './socket-io-adapter';

async function bootstrap() {
  const app = await NestFactory.create<NestApplication>(AppModule);
  const config = app.get(ConfigService);
  app.enableCors();
  app.useWebSocketAdapter(new SocketIOAdapter(app));

  const port = parseInt(config.get('PORT'));
  await app.listen(port);
}
bootstrap();
