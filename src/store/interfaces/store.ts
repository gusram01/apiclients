export interface IStore {
  getAll: (table: string) => Promise<any[]>;
  getOne: (table: string, id: string) => any;
  newUser: (table: string, user: any) => Promise<any>;
  updateUser: (table: string, id: string, user: any) => any;
  delUser: (table: string, id: string) => any;
  login: (table: string, id: string) => any;
  findId: (table: string, id: string) => any;
}
