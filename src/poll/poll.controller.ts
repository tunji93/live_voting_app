import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PollService } from './poll.service';
import { CreatePollDto } from './dto/create-poll.dto';

import { UpdatePollDto } from './dto/update-poll.dto';
import { JoinPollDto } from './dto/join-poll.dto';
import { JoinPollResponseDto } from './dto/join-poll-response.dto';
import { Poll } from 'src/interfaces/poll';
import { PollAuthGuard } from './poll-auth.guard';
import { PollResponse } from 'src/interfaces/poll-response';

@UsePipes(new ValidationPipe())
@Controller('poll')
export class PollController {
  constructor(private readonly pollService: PollService) {}

  @Post()
  async createPoll(
    @Body() createPollDto: CreatePollDto,
  ): Promise<PollResponse> {
    return await this.pollService.createPoll(createPollDto);
  }

  @Post('join')
  joinPoll(@Body() joinPollDto: JoinPollDto): Promise<PollResponse> {
    return this.pollService.joinPoll(joinPollDto);
  }

  // @UseGuards(PollAuthGuard)
  // @Post('rejoin')
  // rejoinPoll(@Request() req: RequestWithAuth): Promise<PollResponse> {
  //   const { userId, pollId, name } = req;
  //   return this.pollService.reJoinPoll({ userId, pollId, name });
  // }
}
