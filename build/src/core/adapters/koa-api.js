"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthNowKoaBackendServer = void 0;
const koa_1 = __importDefault(require("koa"));
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const koa_cors_1 = __importDefault(require("koa-cors"));
const http_error_handler_1 = require("./http-error-handler");
const jsonwebtoken_1 = require("jsonwebtoken");
const koa2_swagger_ui_1 = require("koa2-swagger-ui");
const yamljs_1 = __importDefault(require("yamljs"));
class HealthNowKoaBackendServer {
    constructor(opts) {
        this._koa = new koa_1.default();
        this._router = opts.router;
        this._logger = opts.logger;
        this._port = opts.port;
        this._koa.use((0, koa_bodyparser_1.default)());
        this._koa.use((0, koa_cors_1.default)({ origin: '*' }));
        const spec = yamljs_1.default.load(`${process.cwd()}/api-docs.yaml`);
        this._koa.use((0, koa2_swagger_ui_1.koaSwagger)({ routePrefix: '/docs', swaggerOptions: { spec } }));
        this._koa.use(async (ctx, next) => {
            try {
                await next();
            }
            catch (err) {
                if (err instanceof http_error_handler_1.HealthNowHttpErrorHandler) {
                    ctx.body = err;
                    ctx.status = err.status;
                }
                else if (err instanceof jsonwebtoken_1.TokenExpiredError) {
                    ctx.status = 401;
                    ctx.body = new http_error_handler_1.ExpiredTokenHttpError();
                    return;
                }
                ctx.app.emit('error', err, ctx);
            }
        });
        this._koa.on('error', (err) => {
            this.logger.error({ module: 'Koa', message: err });
        });
        this._koa.use(this._router.routes()).use(this._router.allowedMethods());
    }
    get logger() {
        return this._logger;
    }
    set logger(logger) {
        this._logger = logger;
    }
    start() {
        this.server = this._koa.listen(this._port, () => {
            this._logger.info({
                module: 'KOA',
                message: `Server ready at http://localhost:${this._port}`,
            });
        });
        return this._koa;
    }
    stop() {
        throw new Error('Method not implemented.');
    }
}
exports.HealthNowKoaBackendServer = HealthNowKoaBackendServer;
//# sourceMappingURL=koa-api.js.map