import { IsString } from 'class-validator';

export class AddNominationDto {
  @IsString()
  text: string;
}
