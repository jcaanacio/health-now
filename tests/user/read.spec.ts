import { setup } from '../set-up';
import { describe } from 'mocha';
import request from 'supertest';
import { expect } from 'chai';
import { IHealthNowBackendServer } from '../../src/core/interfaces/app';

let test:
  | {
      adminToken: string;
      userToken: string;
      app: IHealthNowBackendServer;
      port: number;
      user: { id: number | undefined };
    }
  | undefined;
describe('GET/', async () => {
  before('start backend', async () => {
    test = await setup.start();
  });

  after('stop backend', async () => {
    await setup.stop();
  });

  it('GET/: Admins should be able to get users', async () => {
    request(test?.app)
      .get(`/api/user/`)
      .set('Authorization', `Bearer ${test?.adminToken}`)
      .end((_err, res) => {
        expect(res.status).equal(200);
      });
  });

  it('GET/: Admins should be able to get user', async () => {
    request(test?.app)
      .get(`/api/user/${test?.user.id?.toString()}`)
      .set('Authorization', `Bearer ${test?.adminToken}`)
      .end((_err, res) => {
        expect(res.status).equal(200);
      });
  });

  it('GET/: Regular user should not be able to get user', async () => {
    request(test?.app)
      .get(`/api/user/${test?.user.id?.toString()}`)
      .set('Authorization', `Bearer ${test?.userToken}`)
      .end((_err, res) => {
        expect(res.status).equal(401);
      });
  });
});
