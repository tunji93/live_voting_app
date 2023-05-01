import { IsString } from 'class-validator';
import { JoinPollDto } from './join-poll.dto';

export class JoinPollResponseDto extends JoinPollDto {
  @IsString()
  userId: string;
}
