import { QueryResult } from 'pg';

export interface IStore {
  query: (
    query: {
      select: string;
      where: string;
    },
    values: any
  ) => Promise<QueryResult<any>>;
  getAll: () => any;
  getOne: (id: string) => any;
  newUser: (user: any) => any;
  updateUser: (id: string, user: any) => any;
  delUser: (id: string) => any;
  login: (id: string) => any;
  findId: (id: string) => any;
}
