import { IUser, UserRole } from '../interfaces/entities/user';
import { IUserService } from '../interfaces/service';
import { User } from '../models/user';

export class UserService implements IUserService {
  private _repository = User;

  async read(id: string): Promise<User | null | undefined> {
    return await this._repository.findOne(id);
  }

  async reads(input?: IUser): Promise<User[] | null | undefined> {
    return await this._repository.find(input);
  }

  async delete(id: string): Promise<User | null | undefined> {
    const user = await this._repository.findOne({ where: { id } });
    if (!user) throw new Error('Resource not found');
    return await user.remove();
  }

  async update(
    id: string,
    input?: {
      firstname?: string;
      lastname?: string;
      address?: string;
      phone?: number;
      postcode?: number;
      role?: UserRole;
    }
  ): Promise<User | null | undefined> {
    const user = await this._repository.update(id, { ...input });
    return user.raw;
  }

  async create(input: IUser): Promise<User> {
    return await this._repository.create(input).save();
  }

  async deleteMany(ids: string[]): Promise<User[] | null | undefined> {
    const users = await this._repository.findByIds(ids);
    users.map(async (user) => {
      await user.remove();
      await user.save();
    });

    return users;
  }
}
