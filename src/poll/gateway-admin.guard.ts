import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsUnauthorizedException } from 'src/exceptions/ws-exceptions';
import { SocketWithAuth } from 'src/interfaces/socket-with-auth';
import { VerifyToken } from 'src/interfaces/verify-token';
import { PollService } from './poll.service';

@Injectable()
export class GatewayAdminGuard implements CanActivate {
  private readonly logger = new Logger(GatewayAdminGuard.name);
  constructor(
    private readonly pollService: PollService,
    private readonly jwtService: JwtService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const socket: SocketWithAuth = context.switchToWs().getClient();
    const token =
      socket.handshake.auth.token || socket.handshake.headers['token'];

    if (!token) {
      throw new WsUnauthorizedException('No token provided');
    }

    try {
      const payload = this.jwtService.verify<VerifyToken>(token);
      const { sub, pollId } = payload;

      const currentPoll = await this.pollService.getPoll(pollId);

      if (sub !== currentPoll.adminId) {
        throw new WsUnauthorizedException('Admin privileges required');
      }
      return true;
    } catch {
      throw new WsUnauthorizedException('Admin privileges required');
    }
  }
}
