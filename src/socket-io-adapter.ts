import { INestApplicationContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, ServerOptions } from 'socket.io';
import { SocketWithAuth } from './interfaces/socket-with-auth';
import { VerifyToken } from './interfaces/verify-token';

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
  (jwtService: JwtService) => (socket: SocketWithAuth, next) => {
    const token =
      socket.handshake.auth.token || socket.handshake.headers['token'];

    try {
      const payload = jwtService.verify<VerifyToken>(token);
      socket.userId = payload.sub;
      socket.pollId = payload.pollId;
      socket.name = payload.name;

      next();
    } catch (error) {
      next(new Error('FORBIDDEN'));
    }
  };
