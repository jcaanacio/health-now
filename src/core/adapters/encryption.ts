import jsonwebtoken, { SignOptions, VerifyOptions } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {
  IHealthNowEncryption,
  TokenPayloadPurpose,
} from '../interfaces/encryption';

const { AUTH_SECRET = 'HEALTH_NOW' } = process.env;

export const healthNowEncryption: IHealthNowEncryption = {
  generateSalt: async (rounds: 10): Promise<string> => {
    return bcrypt.genSalt(rounds);
  },
  hash: async (opts: { data: string; salt: string }): Promise<string> => {
    return bcrypt.hash(opts.data, opts.salt);
  },
  match: async function (opts: {
    inputPassword: string;
    password: string;
  }): Promise<Boolean> {
    return await bcrypt.compare(opts.inputPassword, opts.password);
  },
  decryptBase64: function (input: string): string {
    return Buffer.from(input, 'base64').toString('binary');
  },
  encryptBase64: function (input: string): string {
    return Buffer.from(input, 'binary').toString('base64');
  },
  token: {
    verify: function (token: string, options?: VerifyOptions): any {
      return jsonwebtoken.verify(token, AUTH_SECRET, { ...options });
    },
    sign: function (input: {
      purpose: TokenPayloadPurpose;
      payload: any;
      opts?: SignOptions;
    }): string {
      const { purpose, payload, opts } = input;

      return jsonwebtoken.sign({ purpose, payload }, AUTH_SECRET, {
        algorithm: 'HS256',
        ...opts,
      });
    },
  },
};
