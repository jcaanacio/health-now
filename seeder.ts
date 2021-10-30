import { HealthNowDatabase } from './src/core/adapters/database';
import { HealthNowLogger } from './src/core/adapters/logger';
import fs from 'fs';
import { User } from './src/core/models/user';

const {
  TYPEORM_PASSWORD = 'password',
  TYPEORM_USERNAME = 'root',
  TYPEORM_DATABASE = 'HealthNow',
  TYPEORM_HOST = 'localhost',
  TYPEORM_PORT = 3306,
} = process.env;

const logger = new HealthNowLogger();

const dbConfig = {
  host: TYPEORM_HOST,
  port: +TYPEORM_PORT,
  database: TYPEORM_DATABASE,
  username: TYPEORM_USERNAME,
  password: TYPEORM_PASSWORD,
  logger,
};

const database = new HealthNowDatabase(dbConfig);

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8')
);

const importData = async () => {
  try {
    await database.start();
    const connection = database.dbConnection;

    await connection
      .createQueryBuilder()
      .insert()
      .into(User)
      .values(users)
      .execute();

    console.log(`Data Imported`);
    process.exit();
  } catch (error) {
    console.log(`Error: ${error}`);
  }
};

const destroyData = async () => {
  try {
    await database.start();
    const connection = database.dbConnection;

    await connection.createQueryBuilder().delete().from(User).execute();
    console.log(`Data Destroyed`);
    process.exit();
  } catch (error) {
    console.log(`Error: ${error}`);
  }
};

const command = process.argv[2];

if (command === '-i') {
  importData();
}

if (command === '-d') {
  destroyData();
}
