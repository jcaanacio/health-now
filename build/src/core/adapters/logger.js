"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthNowLogger = void 0;
const winston_1 = __importDefault(require("winston"));
class HealthNowLogger {
    constructor() {
        this._logger = winston_1.default.createLogger();
    }
    error(opts) {
        this._logger.error(`${opts.module}: ${opts.message}`);
    }
    info(opts) {
        this._logger.info(`${opts.module}: ${opts.message}`);
    }
    warning(opts) {
        this._logger.warn(`${opts.module}: ${opts.message}`);
    }
    debug(opts) {
        this._logger.debug(`${opts.module}: ${opts.message}`);
    }
}
exports.HealthNowLogger = HealthNowLogger;
//# sourceMappingURL=logger.js.map