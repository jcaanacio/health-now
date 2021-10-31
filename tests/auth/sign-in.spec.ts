import { setup } from '../set-up';
import { describe } from 'mocha';
import request from 'supertest';
import { expect } from 'chai';
import { IHealthNowBackendServer } from '../../src/core/interfaces/app';
import { healthNowEncryption } from '../../src/core/adapters/encryption';
import {
  ErrorDescription,
  ErrorScope,
} from '../../src/core/adapters/http-error-handler';

let test:
  | {
      adminToken: string;
      userToken: string;
      app: IHealthNowBackendServer;
      port: number;
      user: {
        id: number | undefined;
        username: string | undefined;
      };
    }
  | undefined;
describe.only('AUTH/', async () => {
  before('start backend', async () => {
    test = await setup.start();
  });

  after('stop backend', async () => {
    await setup.stop();
  });

  it('AUTH/: User should be able to sign-in', async () => {
    const input = `${test?.user.username}:1234`;
    const token = healthNowEncryption.encryptBase64(input);
    request(test?.app)
      .post(`/api/auth`)
      .set('Authorization', `Basic ${token}`)
      .end((_err, res) => {
        expect(res.status).equal(200);
        expect(res.body.token).is.not.empty;
        console.log(res.body);
      });
  });

  it('AUTH/: User should be able to sign-in for unsupported strategy', async () => {
    const input = `${test?.user.username}:12456`;
    const token = healthNowEncryption.encryptBase64(input);
    request(test?.app)
      .post(`/api/auth`)
      .set('Authorization', `Bearer ${token}`)
      .end((_err, res) => {
        expect(res.status).is.equal(401);
        expect(res.body.description).equal(
          ErrorDescription.UnSupportedAuthStrategy
        );
        expect(res.body.scope).equal(ErrorScope.Client);
      });
  });

  it('AUTH/: User should be able to sign-in if password is incorrect', async () => {
    const input = `${test?.user.username}:12456`;
    const token = healthNowEncryption.encryptBase64(input);
    request(test?.app)
      .post(`/api/auth`)
      .set('Authorization', `Basic ${token}`)
      .end((_err, res) => {
        expect(res.status).equal(401);
        expect(res.body.description).equal(ErrorDescription.InvalidCredentials);
        expect(res.body.scope).equal(ErrorScope.User);
      });
  });

  it('AUTH/: User should be able to sign-in if username is incorrect', async () => {
    const input = `sampleUserName:1234`;
    const token = healthNowEncryption.encryptBase64(input);
    request(test?.app)
      .post(`/api/auth`)
      .set('Authorization', `Basic ${token}`)
      .end((_err, res) => {
        expect(res.status).equal(401);
        expect(res.body.description).equal(ErrorDescription.InvalidCredentials);
        expect(res.body.scope).equal(ErrorScope.User);
      });
  });
});
