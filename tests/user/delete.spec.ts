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
      user2: { id: number | undefined };
    }
  | undefined;
describe('DELETE/', async () => {
  before('start backend', async () => {
    test = await setup.start();
  });

  after('stop backend', async () => {
    await setup.stop();
  });

  it('DELETE/: End point should be protected', async () => {
    request(test?.app)
      .delete(`/api/user/${test?.user.id?.toString()}`)
      .end((_err, res) => {
        expect(res.status).equal(403);
      });
  });

  it('DELETE/: Admins should be able to delete user', async () => {
    request(test?.app)
      .delete(`/api/user/${test?.user.id?.toString()}`)
      .set('Authorization', `Bearer ${test?.adminToken}`)
      .end((_err, res) => {
        expect(res.status).equal(200);
      });
  });

  it('DELETE/: Regular user should not be able to delete user', async () => {
    request(test?.app)
      .delete(`/api/user/${test?.user.id?.toString()}`)
      .set('Authorization', `Bearer ${test?.userToken}`)
      .end((_err, res) => {
        expect(res.status).equal(401);
      });
  });

  it('DELETE/: Admins should be able to delete multiple users', async () => {
    const userIds = [test?.user.id, test?.user2.id];

    request(test?.app)
      .delete(`/api/user/`)
      .set('Authorization', `Bearer ${test?.adminToken}`)
      .send({ userIds: userIds })
      .end((_err, res) => {
        expect(res.status).equal(200);
      });
  });

  it('DELETE/: Regular user should not be able to multiple users', async () => {
    const userIds = [test?.user.id, test?.user2.id];

    request(test?.app)
      .delete(`/api/user/${test?.user.id?.toString()}`)
      .set('Authorization', `Bearer ${test?.userToken}`)
      .send({ userIds: userIds })
      .end((_err, res) => {
        expect(res.status).equal(401);
      });
  });
});
