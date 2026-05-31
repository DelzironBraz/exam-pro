import { Module } from '@nestjs/common';
import { EnvModule as SharedEnvModule } from '../../shared/config/env';

@Module({
  imports: [SharedEnvModule],
  exports: [SharedEnvModule],
})
export class EnvModule {}
