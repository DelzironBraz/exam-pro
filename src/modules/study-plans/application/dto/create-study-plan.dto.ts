import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateStudyPlanDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  groupId: string;

  @ApiProperty({ example: 'Plano ENEM 2026 - Matemática' })
  @IsString()
  @MaxLength(200)
  title: string;
}
