import { Model } from 'mongoose';

export interface IStore {
  getAll: () => Promise<Model<any, {}>[]>;
  getOne: (id: string) => Promise<Model<any>>;
  postOne: (user: Partial<T>) => Promise<Model<T>>;
  updateOne: (id: string, user: Partial<T>) => Promise<Model<T>>;
  delOne: (id: string) => Promise<Model<any>>;
}
