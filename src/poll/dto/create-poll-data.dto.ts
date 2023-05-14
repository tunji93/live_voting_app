import { CreatePollDto } from './create-poll.dto';
import { IsString } from 'class-validator';

export class CreatePollDataDto extends CreatePollDto {
  @IsString()
  pollId: string;

  @IsString()
  userId: string;
}
