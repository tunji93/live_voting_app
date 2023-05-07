import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RequestWithAuth } from 'src/interfaces/create-poll-response';

@Injectable()
export class PollAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request: RequestWithAuth = context.switchToHttp().getRequest();

    const { access_token } = request.body;

    try {
      const payload = this.jwtService.verify(access_token);
      request.userId = payload.sub;
      request.pollId = payload.pollId;
      request.name = payload.name;
      return true;
    } catch {
      throw new ForbiddenException('Invalid authorization token');
    }
  }
}
