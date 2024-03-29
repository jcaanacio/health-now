import Router from 'koa-router';
import { IHealthNowBackendServer, IHealthNowLogger } from '../interfaces/app';
import Koa from 'koa';
import koaBodyParser from 'koa-bodyparser';
import KoaCors from 'koa-cors';
import {
  ExpiredTokenHttpError,
  HealthNowHttpErrorHandler,
} from './http-error-handler';
import { TokenExpiredError } from 'jsonwebtoken';
import { koaSwagger } from 'koa2-swagger-ui';
import yamljs from 'yamljs';
import { createHttpTerminator } from 'http-terminator';

export class HealthNowKoaBackendServer implements IHealthNowBackendServer {
  private _koa: Koa;
  private _logger: IHealthNowLogger;
  private _port: number;
  private _router: Router;
  server: any;

  constructor(opts: {
    logger: IHealthNowLogger;
    port: number;
    router: Router;
  }) {
    this._koa = new Koa();
    this._router = opts.router;
    this._logger = opts.logger;
    this._port = opts.port;

    this._koa.use(koaBodyParser());
    this._koa.use(KoaCors({ origin: '*' }));

    const spec = yamljs.load(`${process.cwd()}/api-docs.yaml`);

    this._koa.use(
      koaSwagger({ routePrefix: '/docs', swaggerOptions: { spec } })
    );

    this._koa.use(async (ctx: Koa.Context, next: () => Promise<Koa.Next>) => {
      try {
        await next();
      } catch (err: any) {
        if (err instanceof HealthNowHttpErrorHandler) {
          ctx.body = err;
          ctx.status = err.status;
        } else if (err instanceof TokenExpiredError) {
          ctx.status = 401;
          ctx.body = new ExpiredTokenHttpError();

          return;
        }
        ctx.app.emit('error', err, ctx);
      }
    });

    this._koa.on('error', (err) => {
      this.logger.error({ module: 'Koa', message: err });
    });
    this._koa.use(this._router.routes()).use(this._router.allowedMethods());
  }

  get logger(): IHealthNowLogger {
    return this._logger;
  }

  set logger(logger: IHealthNowLogger) {
    this._logger = logger;
  }

  start(): Koa {
    this.server = this._koa.listen(this._port, () => {
      this._logger.info({
        module: 'KOA',
        message: `Server ready at http://localhost:${this._port}`,
      });
    });

    return this._koa;
  }

  async stop(): Promise<void> {
    if (this.server) {
      const koa = this.server;
      const httpTerminator = createHttpTerminator({
        server: koa,
      });

      await httpTerminator.terminate();
    }
  }

  get port(): number {
    return this._port;
  }
}
