import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString, IsUUID, MaxLength, Min } from 'class-validator';

export class AddExamSectionDto {
  @ApiProperty({ example: 'Conhecimentos Gerais' })
  @IsString()
  @MaxLength(120)
  name: string;

  @ApiProperty({ example: 1.5 })
  @IsNumber()
  @Min(0.1)
  weight: number;

  @ApiPropertyOptional({ type: [String], format: 'uuid' })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  questionIds?: string[];
}
