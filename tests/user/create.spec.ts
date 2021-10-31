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
describe('POST/', async () => {
  before('start backend', async () => {
    test = await setup.start();
  });

  after('stop backend', async () => {
    await setup.stop();
  });

  it('POST/: Admins should be able to create user', async () => {
    const body = {
      email: 'sample@gmail.com',
      username: 'juperman',
      password: '1234',
      firstname: 'Jay',
      lastname: 'Anacio',
      address: 'Caloocan',
      phone: 123456,
      postcode: 1400,
      role: 'USER',
    };

    request(test?.app)
      .post(`/api/user/`)
      .set('Authorization', `Bearer ${test?.adminToken}`)
      .set('Content-type', 'application/json')
      .send(body)
      .end((_err, res) => {
        expect(res.status).equal(201);
      });
  });

  it('POST/: Regular user should not be able to create user', async () => {
    const body = {
      email: 'sample@gmail.com',
      username: 'juperman',
      password: '1234',
      firstname: 'Jay',
      lastname: 'Anacio',
      address: 'Caloocan',
      phone: 123456,
      postcode: 1400,
      role: 'USER',
    };

    request(test?.app)
      .post(`/api/user/`)
      .set('Authorization', `Bearer ${test?.userToken}`)
      .set('Content-type', 'application/json')
      .send(body)
      .end((_err, res) => {
        expect(res.status).equal(401);
      });
  });
});
