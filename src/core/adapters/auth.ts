import Koa from 'koa';
import { TokenPayloadPurpose } from '../interfaces/encryption';
import { UserRole } from '../interfaces/entities/user';
import { User } from '../models/user';
import { AuthenticationService } from '../services/authentication';
import { UserService } from '../services/user';
import { healthNowEncryption } from './encryption';
import {
  InsufficientRightsHttpError,
  InvalidTokenHttpError,
  UnAuthorizedHttpError,
  UnSupportedAuthStrategyHttpError,
} from './http-error-handler';

const authenticationService = new AuthenticationService({
  encryptor: healthNowEncryption,
});

const userService = new UserService();

export class AuthenticatonController {
  async protect(
    ctx: Koa.Context,
    next: () => Promise<Koa.Next>
  ): Promise<void> {
    if (ctx.user) await next();

    const { authorization } = ctx.headers;

    if (!authorization) throw new UnAuthorizedHttpError();

    const [strategy, token] = authorization.split(' ');

    if (!strategy || strategy !== 'Bearer')
      throw new UnSupportedAuthStrategyHttpError();

    if (!token) throw new UnAuthorizedHttpError();

    const decoded = healthNowEncryption.token.verify(token) as unknown as {
      purpose: TokenPayloadPurpose;
      payload: User;
    };

    if (decoded.purpose !== TokenPayloadPurpose.SIGN_IN)
      throw new InvalidTokenHttpError();

    const user = await userService.read(
      decoded.payload.id as unknown as string
    );

    if (!user) throw new InvalidTokenHttpError();
    ctx.user = user;
    await next();
  }

  async admin(ctx: Koa.Context, next: () => Promise<Koa.Next>): Promise<void> {
    const user = ctx.user as User;

    if (!user.role) throw new InsufficientRightsHttpError();

    if (user.role !== UserRole.ADMIN) throw new InsufficientRightsHttpError();
    await next();
  }

  async signIn(
    ctx: Koa.Context,
    _next: () => Promise<Koa.Next>
  ): Promise<void> {
    const { authorization } = ctx.header;
    if (!authorization) throw new UnAuthorizedHttpError();
    const token = await authenticationService.signIn(authorization);

    ctx.body = {
      token,
    };

    ctx.status = 200;
  }
}
