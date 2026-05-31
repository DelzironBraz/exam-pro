export interface Logger {
  log(context: string, message: string): void;
  debug(context: string, message: string): void;
  warn(context: string, message: string): void;
  error(context: string, message: string, trace?: string): void;
}

export const LOGGER = Symbol('LOGGER');
