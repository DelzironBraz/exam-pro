import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString, MaxLength } from 'class-validator';

export class CreateAlternativeDto {
  @ApiProperty({ example: 'A' })
  @IsString()
  @MaxLength(10)
  label: string;

  @ApiProperty({ example: 'Alternativa correta' })
  @IsString()
  content: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  isCorrect: boolean;
}
