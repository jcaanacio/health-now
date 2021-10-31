"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationService = void 0;
const http_error_handler_1 = require("../adapters/http-error-handler");
const encryption_1 = require("../interfaces/encryption");
const user_1 = require("../models/user");
class AuthenticationService {
    constructor(opts) {
        this._repository = user_1.User;
        this._encryptor = opts.encryptor;
    }
    deleteMany(_id) {
        throw new Error('Method not implemented.');
    }
    create(_input) {
        throw new Error('Method not implemented.');
    }
    read(_id) {
        throw new Error('Method not implemented.');
    }
    reads(_input) {
        throw new Error('Method not implemented.');
    }
    delete(_id) {
        throw new Error('Method not implemented.');
    }
    update(_id, _input) {
        throw new Error('Method not implemented.');
    }
    async signIn(input) {
        const [strategy, credentials] = input.split(' ');
        if (!strategy || strategy !== 'Basic')
            throw new http_error_handler_1.UnSupportedAuthStrategyHttpError();
        if (!credentials)
            throw new http_error_handler_1.MissingFieldHttpError(['username', 'password']);
        const decrypted = this._encryptor.decryptBase64(credentials);
        const [username, password] = decrypted.split(':');
        const user = await this._repository.findOne({
            where: { username: username },
        });
        if (!user)
            throw new http_error_handler_1.InvalidCredentialsHttpError();
        const isMatch = await user.matchPassword(password);
        if (!isMatch)
            throw new http_error_handler_1.InvalidCredentialsHttpError();
        const token = await this._encryptor.token.sign({
            purpose: encryption_1.TokenPayloadPurpose.SIGN_IN,
            payload: user,
        });
        return token;
    }
    signOut(_input) {
        throw new Error('Method not implemented.');
    }
}
exports.AuthenticationService = AuthenticationService;
//# sourceMappingURL=authentication.js.map