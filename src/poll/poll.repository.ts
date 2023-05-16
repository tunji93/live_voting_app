import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';
import { AddNomination } from 'src/interfaces/add-nomination';
import { AddParticipant } from 'src/interfaces/add-participant';
import { Poll } from 'src/interfaces/poll';
import { submitRanking } from 'src/interfaces/submit-ranking';
import { IORedisKey } from 'src/redis/redis.module';
import { CreatePollDataDto } from './dto/create-poll-data.dto';

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
  }: CreatePollDataDto): Promise<Poll> {
    const initialPoll = {
      id: pollId,
      topic,
      votesPerVoter,
      adminId: userId,
      participants: {},
      nominations: {},
      hasStarted: false,
      rankings: {},
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

  async getPoll(pollID: string): Promise<Poll> {
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
  }: AddParticipant): Promise<Poll> {
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

  async removeParticipant(pollID: string, userID: string): Promise<Poll> {
    const key = `polls:${pollID}`;
    const participantPath = `.participants.${userID}`;

    try {
      await this.redisClient.send_command('JSON.DEL', key, participantPath);

      return this.getPoll(pollID);
    } catch (e) {
      throw new InternalServerErrorException('Failed to remove participant');
    }
  }

  async addNomination({
    pollId,
    nominationId,
    nomination,
  }: AddNomination): Promise<Poll> {
    const key = `polls:${pollId}`;
    const nominationPath = `.nominations.${nominationId}`;

    try {
      await this.redisClient.send_command(
        'JSON.SET',
        key,
        nominationPath,
        JSON.stringify(nomination),
      );

      return this.getPoll(pollId);
    } catch (e) {
      throw new InternalServerErrorException(
        `Failed to add a nomination with nominationID/text: ${nominationId}/${nomination.text} to pollID: ${pollId}`,
      );
    }
  }

  async removeNomination(pollID: string, nominationID: string): Promise<Poll> {
    const key = `polls:${pollID}`;
    const nominationPath = `.nominations.${nominationID}`;

    try {
      await this.redisClient.send_command('JSON.DEL', key, nominationPath);

      return this.getPoll(pollID);
    } catch (e) {
      throw new InternalServerErrorException(
        `Failed to remove nominationID: ${nominationID} from poll: ${pollID}`,
      );
    }
  }

  async startPoll(pollId: string): Promise<Poll> {
    const key = `polls:${pollId}`;
    const path = `.hasStarted`;
    try {
      await this.redisClient.send_command(
        'JSON.SET',
        key,
        path,
        JSON.stringify(true),
      );

      return this.getPoll(pollId);
    } catch (e) {
      throw new InternalServerErrorException(
        `Failed to start poll: pollId: ${pollId}`,
      );
    }
  }

  async submitRanking({
    pollId,
    userId,
    rankings,
  }: submitRanking): Promise<Poll> {
    const key = `polls:${pollId}`;
    const path = `.rankings.${userId}`;
    try {
      await this.redisClient.send_command(
        'JSON.SET',
        key,
        path,
        JSON.stringify(rankings),
      );

      return this.getPoll(pollId);
    } catch (e) {
      throw new InternalServerErrorException(
        `Failed to add Paricipants rankings to pollId: ${pollId}`,
      );
    }
  }

  async deletePoll(pollId: string): Promise<void> {
    const key = `polls:${pollId}`;
    try {
      await this.redisClient.send_command('JSON.DEL', key);
    } catch (e) {
      throw new InternalServerErrorException(
        `Failed to delete poll: ${pollId}`,
      );
    }
  }
}
