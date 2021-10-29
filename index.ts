import { HealthNowKoaBackendServer } from './src/core/adapters/koa-api';
import { HealthNowLogger } from './src/core/adapters/logger';
import { HealthNowDatabase } from './src/core/adapters/database';
import {
  IHealthNowApplicationAttributes,
  IHealthNowDatabaseAttributes,
  IHealthNowLogger,
} from './src/core/interfaces/app';
import Router from 'koa-router';
import apiRouter from './src/core/adapters/routes';
import { HealthNowKoaApp } from './src/core/app';

/**
 * ENV VARIABLES
 */

const {
  TYPEORM_PASSWORD = 'password',
  TYPEORM_USERNAME = 'root',
  TYPEORM_DATABASE = 'HealthNow',
  TYPEORM_HOST = 'localhost',
  TYPEORM_PORT = 3306,
  KOA_PORT = 8000,
} = process.env;

/**
 * HEALTH NOW LOGGER
 */

const logger = new HealthNowLogger();

/**
 * HEALTH NOW DATABASE
 */

const dbConfig: IHealthNowDatabaseAttributes = {
  host: TYPEORM_HOST,
  port: +TYPEORM_PORT,
  database: TYPEORM_DATABASE,
  username: TYPEORM_USERNAME,
  password: TYPEORM_PASSWORD,
  logger,
};

/**
 * HEALTH NOW API SERVER
 */

const backendServer: {
  logger: IHealthNowLogger;
  port: number;
  router: Router;
} = {
  logger: logger,
  port: +KOA_PORT,
  router: apiRouter,
};

const api = new HealthNowKoaBackendServer(backendServer);
const database = new HealthNowDatabase(dbConfig);

const healthNowApp: IHealthNowApplicationAttributes = {
  logger,
  database,
  api,
};

const app = new HealthNowKoaApp(healthNowApp);

app.start();
