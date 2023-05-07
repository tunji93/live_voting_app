import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PollService } from './poll.service';
import { CreatePollDto } from './dto/create-poll.dto';

import { UpdatePollDto } from './dto/update-poll.dto';
import { JoinPollDto } from './dto/join-poll.dto';
import { CreatePollResponseDto } from './dto/create-poll-response.dto';
import { JoinPollResponseDto } from './dto/join-poll-response.dto';
import { CreatePollResponse } from 'src/interfaces/create-poll-response';

@Controller('poll')
export class PollController {
  constructor(private readonly pollService: PollService) {}

  @Post()
  async createPoll(
    @Body() createPollDto: CreatePollDto,
  ): Promise<CreatePollResponse> {
    return await this.pollService.createPoll(createPollDto);
  }

  @Post('join')
  joinPoll(@Body() joinPollDto: JoinPollDto): any {
    return this.pollService.joinPoll(joinPollDto);
  }

  @Post('rejoin')
  rejoinPoll() {
    return 'i want to rejoin poll';
  }
}
