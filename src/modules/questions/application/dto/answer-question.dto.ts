import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsUUID, Min, MinLength, ValidateIf } from 'class-validator';

export class AnswerQuestionDto {
  @ApiPropertyOptional({
    format: 'uuid',
    description: 'Obrigatório para questões de múltipla escolha',
  })
  @ValidateIf((dto: AnswerQuestionDto) => !dto.textAnswer?.trim())
  @IsUUID()
  selectedAlternativeId?: string;

  @ApiPropertyOptional({
    example: 'A resposta correta envolve os três poderes da República.',
    description: 'Obrigatório para questões discursivas',
  })
  @ValidateIf((dto: AnswerQuestionDto) => !dto.selectedAlternativeId?.trim())
  @IsString()
  @MinLength(1)
  textAnswer?: string;

  @ApiProperty({ example: 45, description: 'Time spent answering in seconds' })
  @IsInt()
  @Min(0)
  timeSpentSeconds: number;
}
