import {
  IHealthNowApplication,
  IHealthNowLogger,
  IHealthNowDatabase,
  IHealthNowBackendServer,
  IHealthNowApplicationAttributes,
} from './interfaces/app';

export class HealthNowKoaApp implements IHealthNowApplication {
  _logger: IHealthNowLogger;
  _database: IHealthNowDatabase;
  _api: IHealthNowBackendServer;

  constructor(opts: IHealthNowApplicationAttributes) {
    this._api = opts.api;
    this._database = opts.database;
    this._logger = opts.logger;
  }

  async start(): Promise<void> {
    this.logger.info({
      module: 'Database',
      message: 'Database booting up...',
    });
    await this._database.start();
    this.logger.info({
      module: 'API',
      message: 'API server booting up...',
    });
    await this._api.start();
  }

  async stop(): Promise<void> {
    this.logger.info({
      module: 'Database',
      message: 'Database shutting down...',
    });

    await this._api.stop();

    this.logger.info({
      module: 'API',
      message: 'API server shutting down...',
    });

    await this._api.stop();
  }

  get logger(): IHealthNowLogger {
    return this._logger;
  }

  set logger(logger: IHealthNowLogger) {
    this._logger = logger;
  }

  get database(): IHealthNowDatabase {
    return this._database;
  }

  set database(database: IHealthNowDatabase) {
    this._database = database;
  }

  get api(): IHealthNowBackendServer {
    return this._api;
  }

  set api(api: IHealthNowBackendServer) {
    this._api = api;
  }
}
