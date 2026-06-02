import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsUUID, Min, MinLength, ValidateIf } from 'class-validator';

export class SubmitSimulationAnswerDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  questionId: string;

  @ApiPropertyOptional({
    format: 'uuid',
    description: 'Obrigatório para questões de múltipla escolha',
  })
  @ValidateIf((dto: SubmitSimulationAnswerDto) => !dto.textAnswer?.trim())
  @IsUUID()
  selectedAlternativeId?: string;

  @ApiPropertyOptional({
    description: 'Obrigatório para questões discursivas',
  })
  @ValidateIf((dto: SubmitSimulationAnswerDto) => !dto.selectedAlternativeId?.trim())
  @IsString()
  @MinLength(1)
  textAnswer?: string;

  @ApiProperty({ example: 30 })
  @IsInt()
  @Min(0)
  timeSpentSeconds: number;
}
