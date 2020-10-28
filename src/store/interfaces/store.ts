export interface IStore {
  getAll: (table: string) => Promise<any[]>;
  getOne: (table: string, id: string) => any;
  newOne: (table: string, data: any) => Promise<any>;
  updateOne: (table: string, id: string, data: any) => any;
  delOne: (table: string, id: string) => any;
  login: (table: string, id: string) => any;
}
