"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthNowDatabase = void 0;
const typeorm_1 = require("typeorm");
const user_1 = require("../models/user");
class HealthNowDatabase {
    constructor(opts) {
        this._host = opts.host;
        this._logger = opts.logger;
        this._username = opts.username;
        this._password = opts.password;
        this._database = opts.database;
        this._port = opts.port;
    }
    get host() {
        return this._host;
    }
    get logger() {
        return this._logger;
    }
    set logger(logger) {
        this._logger = logger;
    }
    get database() {
        return this._database;
    }
    set database(database) {
        this._database = database;
    }
    get port() {
        return this._port;
    }
    get username() {
        return this._username;
    }
    get password() {
        return this._password;
    }
    async start() {
        if (!this._connect) {
            const host = this._host;
            this._logger.info({
                module: 'MySql',
                message: `connecting to ${host}`,
            });
            const connection = (0, typeorm_1.createConnection)({
                name: 'default',
                type: 'mysql',
                host: this._host,
                port: this._port,
                username: this._username,
                password: this._password,
                database: this._database,
                synchronize: true,
                entities: [user_1.User],
            });
            this._connect = (async () => {
                this._connection = await connection;
            })();
        }
        return this._connect;
    }
    stop() {
        throw new Error('Method not implemented.');
    }
    get dbConnection() {
        return this._connection;
    }
}
exports.HealthNowDatabase = HealthNowDatabase;
//# sourceMappingURL=database.js.map