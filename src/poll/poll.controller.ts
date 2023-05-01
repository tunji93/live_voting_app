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

@Controller('poll')
export class PollController {
  constructor(private readonly pollService: PollService) {}

  @Post()
  createPoll(@Body() createPollDto: CreatePollDto) {
    return createPollDto;
  }

  @Post('join')
  joinPoll(@Body() joinPollDto: JoinPollDto) {
    return joinPollDto;
  }

  @Post('rejoin')
  rejoinPoll() {
    return 'i want to rejoin poll';
  }
}
