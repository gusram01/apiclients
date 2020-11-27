import { Request } from 'express';

export interface IStore {
  getAll: (request: Request) => Promise<any[]>;
  getOne: (request: Request) => Promise<any>;
  getSome: (request: Request) => Promise<any[]>;
  newOne: (request: Request) => Promise<any>;
  updateOne: (request: Request) => Promise<any>;
  delOne: (request: Request) => Promise<any>;
  roles: () => Promise<any>;
}
