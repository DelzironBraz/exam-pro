import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class AttachTagToQuestionDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  tagId: string;
}

export class AttachTagToGroupDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  tagId: string;
}
