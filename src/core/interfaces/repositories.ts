export interface IUserRepository<T> {
  get(): Promise<T[] | null>;
  getById(id: number): Promise<T | null>;
  add(input: T): Promise<T | null>;
  delete(id: number): Promise<T | null>;
}
