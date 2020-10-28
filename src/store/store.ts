import db from './database';
import { ErrorResponse } from '../utils/ErrorResponse';
import { IStore } from './interfaces/store';
import { newArgs, upArgs } from './getStrings';

export const store: IStore = {
  getAll: async (table: string) => {
    const str =
      table === 'users' || 'customers' || 'cars' ? 'WHERE active=true' : '';
    try {
      const data = await db.manyOrNone(`SELECT * FROM ${table} ${str}`);
      return data;
    } catch (error) {
      throw new ErrorResponse(400, error.message);
    }
  },
  getOne: async (table: string, id: string) => {
    const str =
      table === 'users' || 'customers' || 'cars' ? 'AND active=true' : '';
    try {
      const data = await db.oneOrNone(
        `SELECT * FROM ${table} WHERE _id=$1 ${str}`,
        id
      );
      return data;
    } catch (error) {
      throw new ErrorResponse(400, error.message);
    }
  },
  newOne: async (table: string, data: any) => {
    try {
      const resp = await newArgs(table, data);
      return await db.oneOrNone(resp.str, resp.arr);
    } catch (error) {
      throw new ErrorResponse(400, error.message);
    }
  },
  updateOne: async (table: string, id: string, data: any) => {
    const aux = upArgs(table, id, data);
    try {
      const doc = await db.oneOrNone(aux.str, aux.arr);
      return doc;
    } catch (error) {
      throw new ErrorResponse(400, error.message);
    }
  },
  delOne: async (table: string, id: string) => {
    const str =
      table === 'users' || 'customers' || 'cars' ? 'AND active=true' : '';
    try {
      const data = await db.oneOrNone(
        `UPDATE ${table} SET active = false, updated_at = NOW() WHERE _id=$1 ${str}`,
        id
      );
      return data;
    } catch (error) {
      throw new ErrorResponse(400, error.message);
    }
  },
  login: (table: string, id: string) => {},
};
