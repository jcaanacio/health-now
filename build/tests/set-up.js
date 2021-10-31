"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.setup = void 0;
const database_1 = require("../src/core/adapters/database");
const koa_api_1 = require("../src/core/adapters/koa-api");
const logger_1 = require("../src/core/adapters/logger");
const routes_1 = __importDefault(require("../src/core/adapters/routes"));
const app_1 = require("../src/core/app");
const fs_1 = __importDefault(require("fs"));
const bluebird_1 = __importDefault(require("bluebird"));
const encryption_1 = require("../src/core/adapters/encryption");
const user_1 = require("../src/core/models/user");
const encryption_2 = require("../src/core/interfaces/encryption");
const user_2 = require("../src/core/interfaces/entities/user");
const { TYPEORM_PASSWORD = 'password', TYPEORM_USERNAME = 'root', TYPEORM_DATABASE = 'HealthNow', TYPEORM_HOST = 'localhost', TYPEORM_PORT = 3306, KOA_PORT = 8000, } = process.env;
const logger = new logger_1.HealthNowLogger();
const dbConfig = {
    host: TYPEORM_HOST,
    port: +TYPEORM_PORT,
    database: TYPEORM_DATABASE,
    username: TYPEORM_USERNAME,
    password: TYPEORM_PASSWORD,
    logger,
};
const backendServer = {
    logger: logger,
    port: +KOA_PORT,
    router: routes_1.default,
};
const api = new koa_api_1.HealthNowKoaBackendServer(backendServer);
const database = new database_1.HealthNowDatabase(dbConfig);
const healthNowApp = {
    logger,
    database,
    api,
};
const app = new app_1.HealthNowKoaApp(healthNowApp);
console.log(process.cwd());
const users = JSON.parse(fs_1.default.readFileSync(`${process.cwd()}/_data/users.json`, 'utf-8'));
exports.setup = {
    start: async () => {
        await app.start();
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
            const adminUser = await user_1.User.findOne({
                where: { role: user_2.UserRole.ADMIN },
            });
            const adminToken = encryption_1.healthNowEncryption.token.sign({
                purpose: encryption_2.TokenPayloadPurpose.SIGN_IN,
                payload: adminUser,
            });
            const user = await user_1.User.findOne({
                where: { role: user_2.UserRole.USER },
            });
            const userToken = encryption_1.healthNowEncryption.token.sign({
                purpose: encryption_2.TokenPayloadPurpose.SIGN_IN,
                payload: user,
            });
            if (!adminToken)
                throw new Error('Something went wrong');
            return { adminToken, userToken, app };
        }
        catch (error) {
            console.log(`Error: ${error}`);
        }
    },
    stop: async () => {
        try {
            await database.start();
            const connection = database.dbConnection;
            await connection.createQueryBuilder().delete().from(user_1.User).execute();
            console.log(`Data Destroyed`);
        }
        catch (error) {
            console.log(`Error: ${error}`);
        }
    },
};
exports.server = api.server;
//# sourceMappingURL=set-up.js.map