import { SignOptions, VerifyOptions } from 'jsonwebtoken';

export enum TokenPayloadPurpose {
  REGISTER = 'REGISTER',
  SIGN_IN = 'SIGN_IN',
}

export interface IHealthNowEncryption {
  generateSalt(rounds?: number): Promise<string>;
  hash(opts: { data: string; salt: string }): Promise<string>;
  match(opts: { inputPassword: string; password: string }): Promise<Boolean>;
  decryptBase64(input: string): string;
  encryptBase64(input: string): string;
  token: {
    sign(input: {
      purpose: TokenPayloadPurpose;
      payload: any;
      opts?: SignOptions;
    }): string;
    verify(token: string, options?: VerifyOptions): string;
  };
}
