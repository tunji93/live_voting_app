import { Module } from '@nestjs/common';
import { PollService } from './poll.service';
import { PollController } from './poll.controller';
import { redisModule } from 'src/modules.config';

@Module({
  imports: [redisModule],
  controllers: [PollController],
  providers: [PollService],
})
export class PollModule {}
