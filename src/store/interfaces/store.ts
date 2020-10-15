import { Model } from 'mongoose';

export interface IStore {
  getAll: () => Promise<Model<any, {}>[]>;
  getOne: (id: string) => Promise<Model<any>>;
  //@ts-expect-error
  newUser: (user: Partial<T>) => Promise<Model<T>>;
  //@ts-expect-error
  updateUser: (id: string, user: Partial<T>) => Promise<Model<T>>;
  delUser: (id: string) => Promise<Model<any>>;
  login: (id: string) => Promise<any>;
  findId: (id: string) => Promise<Model<any>>;
}
