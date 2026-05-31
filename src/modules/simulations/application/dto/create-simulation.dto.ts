import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  ValidateIf,
} from 'class-validator';
import { TimerMode } from '../../domain/enums/timer-mode.enum';

export class CreateSimulationDto {
  @ApiProperty({ example: 'Simulado ENEM - Matemática' })
  @IsString()
  @MaxLength(200)
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  groupId: string;

  @ApiProperty({ enum: TimerMode, example: TimerMode.FIXED })
  @IsEnum(TimerMode)
  timerMode: TimerMode;

  @ApiPropertyOptional({ example: 90 })
  @ValidateIf((dto: CreateSimulationDto) => dto.timerMode === TimerMode.FIXED)
  @IsInt()
  @Min(1)
  durationMinutes?: number;

  @ApiProperty({ type: [String], format: 'uuid' })
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID('4', { each: true })
  questionIds: string[];
}
