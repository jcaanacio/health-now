export interface IUser {
  email: string;
  username: string;
  password: string;
  firstname?: string;
  lastname?: string;
  address?: string;
  phone?: number;
  postcode?: number;
  role?: UserRole;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}
