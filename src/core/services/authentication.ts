import {
  InvalidCredentialsHttpError,
  MissingFieldHttpError,
  UnSupportedAuthStrategyHttpError,
} from '../adapters/http-error-handler';
import {
  IHealthNowEncryption,
  TokenPayloadPurpose,
} from '../interfaces/encryption';
import { IUser } from '../interfaces/entities/user';
import { IAuthenticationService } from '../interfaces/service';
import { User } from '../models/user';

export class AuthenticationService implements IAuthenticationService {
  private _repository = User;
  private _encryptor: IHealthNowEncryption;

  constructor(opts: { encryptor: IHealthNowEncryption }) {
    this._encryptor = opts.encryptor;
  }
  create(_input: IUser): Promise<User> {
    throw new Error('Method not implemented.');
  }
  read(_id?: string): Promise<User | null | undefined> {
    throw new Error('Method not implemented.');
  }
  reads(_input?: IUser): Promise<User[] | null | undefined> {
    throw new Error('Method not implemented.');
  }
  delete(_id: string): Promise<User | null | undefined> {
    throw new Error('Method not implemented.');
  }
  update(_id: string, _input?: IUser): Promise<User | null | undefined> {
    throw new Error('Method not implemented.');
  }

  async signIn(input: string): Promise<string> {
    const [strategy, credentials] = input.split(' ');

    if (!strategy || strategy !== 'Basic')
      throw new UnSupportedAuthStrategyHttpError();

    if (!credentials) throw new MissingFieldHttpError(['username', 'password']);

    const decrypted = this._encryptor.decryptBase64(credentials);
    const [username, password] = decrypted.split(':');

    const user = await this._repository.findOne({
      where: { username: username },
    });

    if (!user) throw new InvalidCredentialsHttpError();

    const isMatch = await user.matchPassword(password);

    if (!isMatch) throw new InvalidCredentialsHttpError();

    const token = await this._encryptor.token.sign({
      purpose: TokenPayloadPurpose.SIGN_IN,
      payload: user,
    });

    return token;
  }

  signOut(_input: { jwt: string }): Promise<IUser> {
    throw new Error('Method not implemented.');
  }
}
