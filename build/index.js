"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_api_1 = require("./src/core/adapters/koa-api");
const logger_1 = require("./src/core/adapters/logger");
const database_1 = require("./src/core/adapters/database");
const routes_1 = __importDefault(require("./src/core/adapters/routes"));
const app_1 = require("./src/core/app");
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
app.start();
//# sourceMappingURL=index.js.map