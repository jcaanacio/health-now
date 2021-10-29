export interface IHealthNowLoggerAttributes {
  module: string;
  message?: string;
}

export interface IHealthNowLogger {
  error(opts: IHealthNowLoggerAttributes): void;
  info(opts: IHealthNowLoggerAttributes): void;
  warning(opts: IHealthNowLoggerAttributes): void;
  debug(opts: IHealthNowLoggerAttributes): void;
}

export interface IHealthNowLoggerAttributes {
  module: string;
  message?: string;
}

export interface IHealthNowApplicationMethods {
  start(): Promise<void>;
  stop(): Promise<void>;
}

export interface IHealthNowApplicationAttributes {
  logger: IHealthNowLogger;
  database: IHealthNowDatabase;
  api: IHealthNowBackendServer;
}

export interface IHealthNowBackendServer {
  logger: IHealthNowLogger;
  start(): void;
  stop(): void;
}

export interface IHealthNowDatabaseAttributes {
  host: string;
  port: number;
  username: string;
  password: string;
  logger: IHealthNowLogger;
  database: string;
}

export interface IHealthNowDatabase
  extends IHealthNowDatabaseAttributes,
    IHealthNowApplicationMethods {}

export interface IHealthNowApplication
  extends IHealthNowApplicationMethods,
    IHealthNowApplicationAttributes {}

export interface IHealthNowService {}
