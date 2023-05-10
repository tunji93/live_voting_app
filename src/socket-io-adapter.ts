import { INestApplicationContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, ServerOptions } from 'socket.io';
import { Socket } from 'socket.io';

export class SocketIOAdapter extends IoAdapter {
  constructor(private app: INestApplicationContext) {
    super(app);
  }

  createIOServer(port: number, options?: ServerOptions) {
    const jwtService = this.app.get(JwtService);

    const server: Server = super.createIOServer(port, {
      ...options,
      cors: true,
    });

    server.of('polls').use(createTokenMiddleware(jwtService));

    return server;
  }
}

const createTokenMiddleware =
  (jwtService: JwtService) =>
  (socket: Socket & { userId: string; pollId: string; name: string }, next) => {
    const token =
      socket.handshake.auth.token || socket.handshake.headers['token'];

    try {
      const payload = jwtService.verify(token);
      socket.userId = payload.sub;
      socket.pollId = payload.pollId;
      socket.name = payload.name;
      next();
    } catch {
      next(new Error('FORBIDDEN'));
    }
  };
