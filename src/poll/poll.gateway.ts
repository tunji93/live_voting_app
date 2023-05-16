import {
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Namespace } from 'socket.io';
import { WsCatchAllFilter } from 'src/exceptions/ws-catch-all-filter';
import { SocketWithAuth } from 'src/interfaces/socket-with-auth';
import { AddNominationDto } from './dto/add-nomination.dto';
import { GatewayAdminGuard } from './gateway-admin.guard';
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

  @UseGuards(GatewayAdminGuard)
  @SubscribeMessage('remove_participant')
  async removeParticipant(
    @MessageBody('id') id: string,
    @ConnectedSocket() client: SocketWithAuth,
  ) {
    const updatedPoll = await this.pollsService.removeParticipant(
      client.pollId,
      id,
    );
    if (updatedPoll) {
      this.io.to(client.pollId).emit('poll_updated', updatedPoll);
    }
  }

  @SubscribeMessage('nominate')
  async nominate(
    @MessageBody() nomination: AddNominationDto,
    @ConnectedSocket() client: SocketWithAuth,
  ) {
    const updatedPoll = await this.pollsService.addNomination({
      pollId: client.pollId,
      userId: client.userId,
      text: nomination.text,
    });

    this.io.to(client.pollId).emit('poll_updated', updatedPoll);
  }

  @UseGuards(GatewayAdminGuard)
  @SubscribeMessage('remove_nomination')
  async removeNomination(
    @MessageBody('id') nominationId: string,
    @ConnectedSocket() client: SocketWithAuth,
  ) {
    const updatedPoll = await this.pollsService.removeNomination(
      client.pollId,
      nominationId,
    );

    this.io.to(client.pollId).emit('poll_updated', updatedPoll);
  }

  @UseGuards(GatewayAdminGuard)
  @SubscribeMessage('start_poll')
  async startPoll(@ConnectedSocket() client: SocketWithAuth) {
    const updatedPoll = await this.pollsService.startPoll(client.pollId);

    this.io.to(client.pollId).emit('poll_updated', updatedPoll);
  }

  @SubscribeMessage('submit_rankings')
  async submitRankings(
    @ConnectedSocket() client: SocketWithAuth,
    @MessageBody('rankings') rankings: string[],
  ) {
    const updatedPoll = await this.pollsService.submitRankings({
      pollId: client.pollId,
      userId: client.userId,
      rankings,
    });
    this.io.to(client.pollId).emit('poll_updated', updatedPoll);
  }

  @UseGuards(GatewayAdminGuard)
  @SubscribeMessage('cancel_poll')
  async cancelPoll(@ConnectedSocket() client: SocketWithAuth): Promise<void> {
    await this.pollsService.cancelPoll(client.pollId);

    this.io.to(client.pollId).emit('poll_cancelled');
  }
}
