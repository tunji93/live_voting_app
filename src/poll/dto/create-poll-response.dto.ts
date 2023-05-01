import { CreatePollDto } from './create-poll.dto';
import { IsString } from 'class-validator';

export class CreatePollResponseDto extends CreatePollDto {
  @IsString()
  pollId: string;

  @IsString()
  userId: string;
}
