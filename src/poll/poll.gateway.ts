import {
  OnGatewayInit,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Namespace, Socket } from 'socket.io';

import { PollService } from './poll.service';

@WebSocketGateway({
  namespace: 'polls',
})
export class PollsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly pollsService: PollService) {}

  @WebSocketServer() io: Namespace;

  // Gateway initialized (provided in module and instantiated)
  afterInit(): void {}

  async handleConnection(
    client: Socket & { userId: string; pollId: string; name: string },
  ) {
    const sockets = this.io.sockets;
    console.log(client.id, client.userId, client.name, client.pollId);
    console.log(sockets.size);
    this.io.emit('hello', client.id);
  }

  async handleDisconnect(
    client: Socket & { userId: string; pollId: string; name: string },
  ) {
    const sockets = this.io.sockets;
    console.log(client.id);
    console.log(sockets.size);
  }
}
