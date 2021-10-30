import { User } from '../models/user';
import { IUser } from './entities/user';

export interface IService<T, Entity> {
  create(input: T): Promise<Entity>;
  read(id?: string): Promise<Entity | null | undefined>;
  reads(input?: T): Promise<Entity[] | null | undefined>;
  delete(id: string): Promise<Entity | null | undefined>;
  update(id: string, input?: IUser): Promise<Entity | null | undefined>;
}

export type IUserService = IService<IUser, User>;

export interface IAuthenticationService extends IService<IUser, User> {
  signIn(input: string): Promise<string>;
  signOut(input: { jwt: string }): Promise<IUser>;
}
