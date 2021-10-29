import winston from 'winston';
import {
  IHealthNowLogger,
  IHealthNowLoggerAttributes,
} from '../interfaces/app';

export class HealthNowLogger implements IHealthNowLogger {
  private _logger = winston.createLogger();
  error(opts: IHealthNowLoggerAttributes): void {
    this._logger.error(`${opts.module}: ${opts.message}`);
  }
  info(opts: IHealthNowLoggerAttributes): void {
    this._logger.info(`${opts.module}: ${opts.message}`);
  }
  warning(opts: IHealthNowLoggerAttributes): void {
    this._logger.warn(`${opts.module}: ${opts.message}`);
  }
  debug(opts: IHealthNowLoggerAttributes): void {
    this._logger.debug(`${opts.module}: ${opts.message}`);
  }
}
