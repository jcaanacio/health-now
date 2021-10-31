/**
 * ENV VARIABLES
 */

import Router from 'koa-router';
import { HealthNowDatabase } from '../src/core/adapters/database';
import { HealthNowKoaBackendServer } from '../src/core/adapters/koa-api';
import { HealthNowLogger } from '../src/core/adapters/logger';
import apiRouter from '../src/core/adapters/routes';
import { HealthNowKoaApp } from '../src/core/app';
import {
  IHealthNowDatabaseAttributes,
  IHealthNowLogger,
  IHealthNowApplicationAttributes,
  IHealthNowBackendServer,
} from '../src/core/interfaces/app';
import fs from 'fs';
import Bluebird from 'bluebird';
import { healthNowEncryption } from '../src/core/adapters/encryption';
import { User } from '../src/core/models/user';
import { TokenPayloadPurpose } from '../src/core/interfaces/encryption';
import { UserRole } from '../src/core/interfaces/entities/user';
import { Not } from 'typeorm';

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
console.log(process.cwd());
const users = JSON.parse(
  fs.readFileSync(`${process.cwd()}/_data/users.json`, 'utf-8')
);

export const setup = {
  start: async (): Promise<
    | {
        adminToken: string;
        userToken: string;
        app: IHealthNowBackendServer;
        port: number;
        user: User;
        user2: { id: number | undefined };
      }
    | undefined
  > => {
    await app.start();
    try {
      await database.start();
      const connection = database.dbConnection;
      await Bluebird.map(users, async (user: { password: string }) => {
        const password = user.password;
        const salt = await healthNowEncryption.generateSalt(10);
        const encryptedPassword = await healthNowEncryption.hash({
          data: password,
          salt,
        });
        user.password = encryptedPassword;
      });

      await connection
        .createQueryBuilder()
        .insert()
        .into(User)
        .values(users)
        .execute();

      const adminUser = await User.findOne({
        where: { role: UserRole.ADMIN },
      });

      const adminToken = healthNowEncryption.token.sign({
        purpose: TokenPayloadPurpose.SIGN_IN,
        payload: adminUser,
      });

      const user = await User.findOne({
        where: { role: UserRole.USER },
      });

      const testUser1 = await User.findOne({ where: { id: Not(user?.id) } });
      const testUser2 = await User.findOne({
        where: { id: Not(adminUser?.id) },
      });

      const userToken = healthNowEncryption.token.sign({
        purpose: TokenPayloadPurpose.SIGN_IN,
        payload: user,
      });

      if (!adminToken) throw new Error('Something went wrong');
      return {
        adminToken,
        userToken,
        app: app.api.server,
        port: app.api.port,
        user: testUser1 as User,
        user2: { id: testUser2?.id },
      };
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  },
  stop: async () => {
    try {
      await database.start();
      const connection = database.dbConnection;

      await connection.createQueryBuilder().delete().from(User).execute();
      await app.api.stop();
      console.log(`Data Destroyed`);
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  },
};
