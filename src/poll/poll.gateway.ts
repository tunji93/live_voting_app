import {
  BadRequestException,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  OnGatewayInit,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Namespace } from 'socket.io';
import { WsCatchAllFilter } from 'src/exceptions/ws-catch-all-filter';
import { SocketWithAuth } from 'src/interfaces/create-poll-response';

import { PollService } from './poll.service';
@UsePipes(new ValidationPipe())
@UseFilters(new WsCatchAllFilter())
@WebSocketGateway({
  namespace: 'polls',
})
export class PollsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly pollsService: PollService) {}

  @WebSocketServer() io: Namespace;
  async handleConnection(client: SocketWithAuth) {
    const { pollId, userId, name } = client;
    const roomName = pollId;
    await client.join(roomName);
    const updatedPoll = await this.pollsService.addParticipant({
      pollId,
      name,
      userId,
    });
    this.io.to(roomName).emit('poll_updated', updatedPoll);
  }

  async handleDisconnect(client: SocketWithAuth) {
    const roomName = client.pollId;
    const updatedPoll = this.pollsService.removeParticipant(
      client.userId,
      client.pollId,
    );
    if (updatedPoll) {
      this.io.to(roomName).emit('poll_updated', updatedPoll);
    }
  }

  @SubscribeMessage('test')
  async test() {
    throw new BadRequestException('error');
  }
}
