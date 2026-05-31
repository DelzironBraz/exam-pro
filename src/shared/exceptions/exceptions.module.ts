import { Global, Module } from '@nestjs/common';
import { EXCEPTIONS_SERVICE } from '../domain/exceptions/exceptions.interface';
import { NestExceptionsService } from './exceptions.service';

@Global()
@Module({
  providers: [
    NestExceptionsService,
    {
      provide: EXCEPTIONS_SERVICE,
      useExisting: NestExceptionsService,
    },
  ],
  exports: [NestExceptionsService, EXCEPTIONS_SERVICE],
})
export class ExceptionsModule {}
