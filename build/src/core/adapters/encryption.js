"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthNowEncryption = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const { AUTH_SECRET = 'HEALTH_NOW' } = process.env;
exports.healthNowEncryption = {
    generateSalt: async (rounds) => {
        return bcrypt_1.default.genSalt(rounds);
    },
    hash: async (opts) => {
        return bcrypt_1.default.hash(opts.data, opts.salt);
    },
    match: async function (opts) {
        return await bcrypt_1.default.compare(opts.inputPassword, opts.password);
    },
    decryptBase64: function (input) {
        return new Buffer(input, 'base64').toString();
    },
    encryptBase64: function (input) {
        return btoa(input);
    },
    token: {
        verify: function (token, options) {
            return jsonwebtoken_1.default.verify(token, AUTH_SECRET, { ...options });
        },
        sign: function (input) {
            const { purpose, payload, opts } = input;
            return jsonwebtoken_1.default.sign({ purpose, payload }, AUTH_SECRET, {
                algorithm: 'HS256',
                ...opts,
            });
        },
    },
};
//# sourceMappingURL=encryption.js.map