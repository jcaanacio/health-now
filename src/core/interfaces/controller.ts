export interface IController<Context, Next> {
  create(ctx: Context, next: () => Promise<Next>): Promise<void>;
  read(ctx: Context, next: () => Promise<Next>): Promise<void>;
  readById(ctx: Context, next: () => Promise<Next>): Promise<void>;
  update(ctx: Context, next: () => Promise<Next>): Promise<void>;
  delete(ctx: Context, next: () => Promise<Next>): Promise<void>;
}
