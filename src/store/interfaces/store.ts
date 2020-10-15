import { Model } from 'mongoose';

export interface IStore {
  getAll: () => Promise<Model<any, {}>[]>;
  getOne: (id: string) => Promise<Model<any>>;
  newUser: (user: Partial<T>) => Promise<Model<T>>;
  updateUser: (id: string, user: Partial<T>) => Promise<Model<T>>;
  delUser: (id: string) => Promise<Model<any>>;
}
