"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticatonController = void 0;
const encryption_1 = require("../interfaces/encryption");
const user_1 = require("../interfaces/entities/user");
const authentication_1 = require("../services/authentication");
const user_2 = require("../services/user");
const encryption_2 = require("./encryption");
const http_error_handler_1 = require("./http-error-handler");
const logger_1 = require("./logger");
const authenticationService = new authentication_1.AuthenticationService({
    encryptor: encryption_2.healthNowEncryption,
});
const userService = new user_2.UserService();
const logger = new logger_1.HealthNowLogger();
class AuthenticatonController {
    async protect(ctx, next) {
        if (ctx.user)
            await next();
        logger.info({ module: 'demo', message: 'demo' });
        const { authorization } = ctx.headers;
        if (!authorization)
            throw new http_error_handler_1.UnAuthorizedHttpError();
        const [strategy, token] = authorization.split(' ');
        if (!strategy || strategy !== 'Bearer')
            throw new http_error_handler_1.UnSupportedAuthStrategyHttpError();
        if (!token)
            throw new http_error_handler_1.UnAuthorizedHttpError();
        const decoded = encryption_2.healthNowEncryption.token.verify(token);
        if (decoded.purpose !== encryption_1.TokenPayloadPurpose.SIGN_IN)
            throw new http_error_handler_1.InvalidTokenHttpError();
        const user = await userService.read(decoded.payload.id);
        if (!user)
            throw new http_error_handler_1.InvalidTokenHttpError();
        ctx.user = user;
        await next();
    }
    async admin(ctx, next) {
        const user = ctx.user;
        if (!user.role)
            throw new http_error_handler_1.InsufficientRightsHttpError();
        if (user.role !== user_1.UserRole.ADMIN)
            throw new http_error_handler_1.InsufficientRightsHttpError();
        await next();
    }
    async signIn(ctx, _next) {
        const { authorization } = ctx.header;
        if (!authorization)
            throw new http_error_handler_1.UnAuthorizedHttpError();
        const token = await authenticationService.signIn(authorization);
        ctx.body = {
            token,
        };
        ctx.status = 200;
    }
}
exports.AuthenticatonController = AuthenticatonController;
//# sourceMappingURL=auth.js.map