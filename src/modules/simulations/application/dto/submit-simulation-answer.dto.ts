import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsUUID, Min } from 'class-validator';

export class SubmitSimulationAnswerDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  questionId: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  selectedAlternativeId: string;

  @ApiProperty({ example: 30 })
  @IsInt()
  @Min(0)
  timeSpentSeconds: number;
}
