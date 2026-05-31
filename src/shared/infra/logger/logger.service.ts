import { Injectable, Logger as NestLogger } from '@nestjs/common';
import { Logger } from '../../domain/logger/logger.interface';

@Injectable()
export class LoggerService implements Logger {
  private readonly logger = new NestLogger();

  log(context: string, message: string): void {
    this.logger.log(message, context);
  }

  debug(context: string, message: string): void {
    this.logger.debug(message, context);
  }

  warn(context: string, message: string): void {
    this.logger.warn(message, context);
  }

  error(context: string, message: string, trace?: string): void {
    this.logger.error(message, trace, context);
  }
}
