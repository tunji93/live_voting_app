import { IsInt, IsString, Length, Max, Min } from 'class-validator';
export class CreatePollDto {
  @IsString()
  @Length(1, 100)
  topic: string;

  @IsInt()
  @Min(1)
  @Max(5)
  maxVotePerVoter: number;

  @IsString()
  @Length(1, 250)
  name: string;
}
