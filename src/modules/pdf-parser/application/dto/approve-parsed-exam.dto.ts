import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class ApproveParsedExamDto {
  @ApiProperty({ example: 'TJ-SP 2025' })
  @IsString()
  @MaxLength(200)
  title: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  groupId: string;

  @ApiProperty({ example: 'TJ-SP' })
  @IsString()
  @MaxLength(120)
  institution: string;

  @ApiProperty({ example: 'Vunesp' })
  @IsString()
  @MaxLength(120)
  organization: string;

  @ApiProperty({ example: 2025 })
  @IsInt()
  @Min(1990)
  @Max(2100)
  year: number;

  @ApiProperty({ example: 'Escrevente Judiciário' })
  @IsString()
  @MaxLength(120)
  roleName: string;

  @ApiProperty({ example: 300 })
  @IsInt()
  @Min(1)
  durationMinutes: number;
}
