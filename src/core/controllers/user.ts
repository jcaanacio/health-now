import { IController } from '../interfaces/controller';
import Koa from 'koa';
import { UserService } from '../services/user';

const service = new UserService();

export class UserKoaController implements IController<Koa.Context, Koa.Next> {
  async create(
    ctx: Koa.Context,
    _next: () => Promise<Koa.Next>
  ): Promise<void> {
    const {
      email,
      username,
      password,
      firstname,
      lastname,
      address,
      phone,
      postcode,
      role,
    } = ctx.request.body;

    const user = await service.create({
      email,
      username,
      password,
      firstname,
      lastname,
      address,
      postcode,
      phone,
      role,
    });

    ctx.body = {
      user: user,
    };

    ctx.status = 201;
  }

  async read(ctx: Koa.Context, _next: () => Promise<Koa.Next>): Promise<void> {
    const users = await service.reads();

    ctx.body = {
      user: users,
    };

    ctx.status = 200;
  }

  async readById(
    ctx: Koa.Context,
    _next: () => Promise<Koa.Next>
  ): Promise<void> {
    const { userId } = ctx.params;
    const user = await service.read(userId);

    ctx.body = {
      user: user,
    };

    ctx.status = 200;
  }

  async update(
    ctx: Koa.Context,
    _next: () => Promise<Koa.Next>
  ): Promise<void> {
    const { userId } = ctx.params;

    const { firstname, lastname, address, phone, postcode, role } =
      ctx.request.body;

    const user = await service.update(userId, {
      firstname,
      lastname,
      address,
      postcode,
      phone,
      role,
    });

    ctx.body = {
      user: user,
    };

    ctx.status = 200;
  }

  async delete(
    ctx: Koa.Context,
    _next: () => Promise<Koa.Next>
  ): Promise<void> {
    const { userId } = ctx.params;
    const user = await service.delete(userId);

    ctx.body = {
      user: user,
    };

    ctx.status = 200;
  }

  async deleteMany(
    ctx: Koa.Context,
    _next: () => Promise<Koa.Next>
  ): Promise<void> {
    const { userIds } = ctx.request.body;
    const user = await service.deleteMany(userIds);

    ctx.body = {
      user: user,
    };

    ctx.status = 200;
  }
}
