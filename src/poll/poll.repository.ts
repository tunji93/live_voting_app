import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';
import {
  AddParticipant,
  CreatePollResponse,
} from 'src/interfaces/create-poll-response';
import { IORedisKey } from 'src/redis/redis.module';
import { CreatePollResponseDto } from './dto/create-poll-response.dto';

@Injectable()
export class PollRepository {
  private readonly ttl: string;
  constructor(
    private configService: ConfigService,
    @Inject(IORedisKey) private readonly redisClient: Redis,
  ) {
    this.ttl = this.configService.get('POLL_DURATION');
  }

  async createPoll({
    votesPerVoter,
    topic,
    pollId,
    userId,
  }: CreatePollResponseDto): Promise<CreatePollResponse> {
    const initialPoll = {
      id: pollId,
      topic,
      votesPerVoter,
      adminId: userId,
      participants: {},
    };

    const key = `polls:${pollId}`;

    try {
      await this.redisClient
        .multi([
          ['send_command', 'JSON.SET', key, '.', JSON.stringify(initialPoll)],
          ['expire', key, this.ttl],
        ])
        .exec();
      return initialPoll;
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async getPoll(pollID: string): Promise<CreatePollResponse> {
    const key = `polls:${pollID}`;

    try {
      const currentPoll = await this.redisClient.send_command(
        'JSON.GET',
        key,
        '.',
      );

      return JSON.parse(currentPoll);
    } catch (e) {
      throw new InternalServerErrorException(`Failed to get pollID ${pollID}`);
    }
  }
  async addParticipant({
    pollId,
    userId,
    name,
  }: AddParticipant): Promise<CreatePollResponse> {
    const key = `polls:${pollId}`;
    const participantPath = `.participants.${userId}`;

    try {
      await this.redisClient.send_command(
        'JSON.SET',
        key,
        participantPath,
        JSON.stringify(name),
      );

      return this.getPoll(pollId);
    } catch (e) {
      throw new InternalServerErrorException(
        `Failed to add a participant with userID/name: ${userId}/${name} to pollID: ${pollId}`,
      );
    }
  }
}
