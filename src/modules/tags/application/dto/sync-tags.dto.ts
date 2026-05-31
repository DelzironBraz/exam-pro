import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class SyncTagsDto {
  @ApiProperty({ example: ['enem', 'matematica'], type: [String] })
  @IsArray()
  @IsString({ each: true })
  names: string[];
}
