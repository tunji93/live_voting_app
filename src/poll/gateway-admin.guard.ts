import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { WsUnauthorizedException } from 'src/exceptions/ws-exceptions';
import { SocketWithAuth } from 'src/interfaces/create-poll-response';
import { PollService } from './poll.service';

@Injectable()
export class GatewayAdminGuard implements CanActivate {
  private readonly logger = new Logger(GatewayAdminGuard.name);
  constructor(
    private readonly pollService: PollService,
    private readonly jwtService: JwtService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // regular `Socket` from socket.io is probably sufficient
    const socket: SocketWithAuth = context.switchToWs().getClient();

    // for testing support, fallback to token header
    const token =
      socket.handshake.auth.token || socket.handshake.headers['token'];
    console.log(token);

    if (!token) {
      throw new WsUnauthorizedException('No token provided');
    }

    try {
      const payload = this.jwtService.verify(token);
      console.log(payload);

      const { sub, poll } = payload;

      const currentPoll = await this.pollService.getPoll(poll);

      if (sub !== currentPoll.adminId) {
        throw new WsUnauthorizedException('Admin privileges required');
      }

      return true;
    } catch {
      throw new WsUnauthorizedException('Admin privileges required');
    }
  }
}
