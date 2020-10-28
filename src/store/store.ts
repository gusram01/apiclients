import db from './database';
import bcrypt from 'bcrypt';
import { ErrorResponse } from '../utils/ErrorResponse';
import { IStore } from './interfaces/store';
import { newArgs, upArgs } from './getStrings';
import { getToken } from '../utils/utilities';

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
  login: async (data: any) => {
    const str = `SELECT _id,password,nick,user_type_id FROM users WHERE email=$1 AND active = true`;

    try {
      const doc = await db.oneOrNone(str, data.email);
      if (!doc) {
        throw new ErrorResponse(400, 'Incorrect email/password');
      }
      const validacion = await bcrypt.compare(data.password, doc.password);
      if (!validacion) {
        throw new ErrorResponse(400, 'Incorrect email/password');
      }
      return { token: getToken(doc._id), id: doc._id };
    } catch (error) {
      throw new ErrorResponse(400, error.message);
    }
  },
};
