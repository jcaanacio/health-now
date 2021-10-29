import {
  IHealthNowDatabase,
  IHealthNowDatabaseAttributes,
  IHealthNowLogger,
} from '../interfaces/app';

import { createConnection } from 'typeorm';
import { User } from '../models/user';

export class HealthNowDatabase implements IHealthNowDatabase {
  private _connect: Promise<void> | undefined;
  private _host: string;
  private _logger: IHealthNowLogger;
  private _database: string;
  private _port: number;
  private _username: string;
  private _password: string;

  constructor(opts: IHealthNowDatabaseAttributes) {
    this._host = opts.host;
    this._logger = opts.logger;
    this._username = opts.username;
    this._password = opts.password;
    this._database = opts.database;
    this._port = opts.port;
  }

  get host(): string {
    return this._host;
  }

  get logger(): IHealthNowLogger {
    return this._logger;
  }

  set logger(logger: IHealthNowLogger) {
    this._logger = logger;
  }

  get database(): string {
    return this._database;
  }

  set database(database: string) {
    this._database = database;
  }

  get port(): number {
    return this._port;
  }

  get username(): string {
    return this._username;
  }

  get password(): string {
    return this._password;
  }

  async start(): Promise<void> {
    if (!this._connect) {
      const host = this._host;

      this._logger.info({
        module: 'MySql',
        message: `connecting to ${host}`,
      });

      const connection = createConnection({
        name: 'default',
        type: 'mysql',
        host: this._host,
        port: this._port,
        username: this._username,
        password: this._password,
        database: this._database,
        synchronize: true,
        entities: [User],
      });

      this._connect = (async function () {
        await connection;
      })();
    }

    return this._connect;
  }

  stop(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
