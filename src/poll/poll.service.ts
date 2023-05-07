import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreatePollResponse } from 'src/interfaces/create-poll-response';
import { createPollId, createUserID } from 'src/utils/generate-id';
import { CreatePollResponseDto } from './dto/create-poll-response.dto';
import { CreatePollDto } from './dto/create-poll.dto';
import { JoinPollResponseDto } from './dto/join-poll-response.dto';
import { JoinPollDto } from './dto/join-poll.dto';
import { PollRepository } from './poll.repository';

@Injectable()
export class PollService {
  constructor(
    private readonly pollRepository: PollRepository,
    private readonly jwtService: JwtService,
  ) {}

  async createPoll(createPollDto: CreatePollDto): Promise<any> {
    const pollId = createPollId();
    const userId = createUserID();
    const poll = await this.pollRepository.createPoll({
      ...createPollDto,
      pollId,
      userId,
    });
    const access_token = this.jwtService.sign({
      sub: userId,
      name: createPollDto.name,
      poll: pollId,
    });

    return {
      poll,
      access_token,
    };
  }

  async joinPoll(joinPollDto: JoinPollDto): Promise<any> {
    const userId = createUserID();
    const poll = await this.pollRepository.addParticipant({
      ...joinPollDto,
      userId,
    });

    const access_token = this.jwtService.sign({
      sub: userId,
      name: joinPollDto.name,
      poll: joinPollDto.pollId,
    });

    return {
      poll,
      access_token,
    };
  }
}
