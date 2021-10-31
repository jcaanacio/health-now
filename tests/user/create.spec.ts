import { setup } from '../set-up';
import { describe } from 'mocha';
import request from 'supertest';
import { expect } from 'chai';
import { IHealthNowBackendServer } from '../../src/core/interfaces/app';
import { IUser } from '../../src/core/interfaces/entities/user';
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
      user: IUser;
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

  it('POST/: Email, Username must be unique', async () => {
    const body = {
      email: test?.user.email,
      username: 'jerrywest',
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
        expect(res.status).equal(412);
        expect(res.body.description).equal(
          ErrorDescription.FieldsAreAlreadyInUse
        );
        expect(res.body.scope).equal(ErrorScope.User);
        expect(res.body.fields).contains('Email');
        expect(res.body.fields).contains('Username');
      });
  });
});
