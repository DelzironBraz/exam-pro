import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class FinishSimulationDto {
  @ApiProperty({ example: 18 })
  @IsInt()
  @Min(0)
  totalCorrect: number;

  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(0)
  totalWrong: number;

  @ApiProperty({ example: 5400, description: 'Total elapsed time in seconds' })
  @IsInt()
  @Min(0)
  totalTimeSeconds: number;
}
