import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, MaxLength, Min } from 'class-validator';

export class AddPlanItemDto {
  @ApiProperty({ example: 'Revisar equações do 2º grau' })
  @IsString()
  @MaxLength(200)
  title: string;

  @ApiProperty({ example: 'Resolver lista de exercícios e anotar dúvidas.' })
  @IsString()
  description: string;

  @ApiProperty({ example: 4 })
  @IsInt()
  @Min(1)
  estimatedHours: number;
}
