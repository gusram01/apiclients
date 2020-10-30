export interface IStore {
  getAll: (table: string) => Promise<any[]>;
  getOne: (table: string, id: string) => Promise<any>;
  getSome: (table: string, data: any) => Promise<any[]>;
  newOne: (table: string, data: any) => Promise<any>;
  updateOne: (table: string, id: string, data: any) => Promise<any>;
  delOne: (table: string, id: string) => Promise<any>;
  login: (data: any) => Promise<any>;
}
