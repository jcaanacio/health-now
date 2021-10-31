"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthNowKoaApp = void 0;
class HealthNowKoaApp {
    constructor(opts) {
        this._api = opts.api;
        this._database = opts.database;
        this._logger = opts.logger;
    }
    async start() {
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
    async stop() {
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
    get api() {
        return this._api;
    }
    set api(api) {
        this._api = api;
    }
}
exports.HealthNowKoaApp = HealthNowKoaApp;
//# sourceMappingURL=app.js.map