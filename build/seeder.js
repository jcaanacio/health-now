"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./src/core/adapters/database");
const logger_1 = require("./src/core/adapters/logger");
const fs_1 = __importDefault(require("fs"));
const user_1 = require("./src/core/models/user");
const encryption_1 = require("./src/core/adapters/encryption");
const bluebird_1 = __importDefault(require("bluebird"));
const { TYPEORM_PASSWORD = 'password', TYPEORM_USERNAME = 'root', TYPEORM_DATABASE = 'HealthNow', TYPEORM_HOST = 'localhost', TYPEORM_PORT = 3306, } = process.env;
const logger = new logger_1.HealthNowLogger();
const dbConfig = {
    host: TYPEORM_HOST,
    port: +TYPEORM_PORT,
    database: TYPEORM_DATABASE,
    username: TYPEORM_USERNAME,
    password: TYPEORM_PASSWORD,
    logger,
};
const database = new database_1.HealthNowDatabase(dbConfig);
const users = JSON.parse(fs_1.default.readFileSync(`${__dirname}/_data/users.json`, 'utf-8'));
const importData = async () => {
    try {
        await database.start();
        const connection = database.dbConnection;
        await bluebird_1.default.map(users, async (user) => {
            const password = user.password;
            const salt = await encryption_1.healthNowEncryption.generateSalt(10);
            const encryptedPassword = await encryption_1.healthNowEncryption.hash({
                data: password,
                salt,
            });
            user.password = encryptedPassword;
        });
        await connection
            .createQueryBuilder()
            .insert()
            .into(user_1.User)
            .values(users)
            .execute();
        console.log(`Data Imported`);
        process.exit();
    }
    catch (error) {
        console.log(`Error: ${error}`);
    }
};
const destroyData = async () => {
    try {
        await database.start();
        const connection = database.dbConnection;
        await connection.createQueryBuilder().delete().from(user_1.User).execute();
        console.log(`Data Destroyed`);
        process.exit();
    }
    catch (error) {
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
//# sourceMappingURL=seeder.js.map