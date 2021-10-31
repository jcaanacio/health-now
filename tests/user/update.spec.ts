import { setup } from '../set-up';
import { describe } from 'mocha';
import request from 'supertest';
import { expect } from 'chai';
import { IHealthNowBackendServer } from '../../src/core/interfaces/app';
import { User } from '../../src/core/models/user';

let test:
  | {
      adminToken: string;
      userToken: string;
      app: IHealthNowBackendServer;
      port: number;
      user: User;
    }
  | undefined;
describe('PATCH/', async () => {
  before('start backend', async () => {
    test = await setup.start();
  });

  after('stop backend', async () => {
    await setup.stop();
  });

  it('PATCH/: End point should be protected', async () => {
    const body = {
      firstname: 'Jay',
      lastname: 'Anacio',
      address: 'Caloocan',
      phone: 123456,
      postcode: 1400,
      role: 'USER',
    };

    request(test?.app)
      .patch(`/api/user/${test?.user.id?.toString()}`)
      .send(body)
      .end((_err, res) => {
        expect(res.status).equal(403);
      });
  });

  it('PATCH/: Admins should be able to update user', async () => {
    const body = {
      firstname: 'Jay',
      lastname: 'Anacio',
      address: 'Caloocan',
      phone: 123456,
      postcode: 1400,
      role: 'USER',
    };

    request(test?.app)
      .patch(`/api/user/${test?.user.id?.toString()}`)
      .send(body)
      .set('Authorization', `Bearer ${test?.adminToken}`)
      .end((_err, res) => {
        expect(res.status).equal(200);
      });
  });

  it('PATCH/: Regular user should not be able to update user', async () => {
    const body = {
      firstname: 'Jay',
      lastname: 'Anacio',
      address: 'Caloocan',
      phone: 123456,
      postcode: 1400,
      role: 'USER',
    };

    request(test?.app)
      .patch(`/api/user/${test?.user.id?.toString()}`)
      .send(body)
      .set('Authorization', `Bearer ${test?.userToken}`)
      .end((_err, res) => {
        expect(res.status).equal(401);
      });
  });
});
