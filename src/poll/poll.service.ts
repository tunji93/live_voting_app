import { Injectable } from '@nestjs/common';
import { createPollId, createUserID } from 'src/utils/generate-id';
import { CreatePollResponseDto } from './dto/create-poll-response.dto';
import { CreatePollDto } from './dto/create-poll.dto';
import { JoinPollResponseDto } from './dto/join-poll-response.dto';
import { JoinPollDto } from './dto/join-poll.dto';

@Injectable()
export class PollService {
  createPoll(createPollDto: CreatePollDto): CreatePollResponseDto {
    const pollId = createPollId();
    const userId = createUserID();

    return {
      ...createPollDto,
      pollId,
      userId,
    };
  }

  joinPoll(joinPollDto: JoinPollDto): JoinPollResponseDto {
    const userId = createUserID();

    return {
      ...joinPollDto,
      userId,
    };
  }
}
