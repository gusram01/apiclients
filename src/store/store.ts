import db from './database';
import bcrypt from 'bcrypt';
import { ErrorResponse } from '../utils/ErrorResponse';
import { allArgs, delArgs, newArgs, oneArgs, upArgs } from './getStrings';
import { getToken } from '../utils/utilities';
import { IStore } from './interfaces/store';

export const store: IStore = {
  getAll: async (table: string) => {
    const str = allArgs(table);
    try {
      const rows = await db.manyOrNone(str);
      return rows;
    } catch (error) {
      throw new ErrorResponse(error.statusCode || 400, error.message);
    }
  },
  getOne: async (table: string, id: string) => {
    const { str, arr } = oneArgs(table, id);
    try {
      const row = await db.oneOrNone(str, arr);
      if (!row) {
        throw new ErrorResponse(404, 'Id not found');
      }
      return row;
    } catch (error) {
      throw new ErrorResponse(error.statusCode || 400, error.message);
    }
  },
  newOne: async (table: string, data: any) => {
    try {
      const { str, arr } = await newArgs(table, data);
      const row = await db.oneOrNone(str, arr);
      return row;
    } catch (error) {
      throw new ErrorResponse(error.statusCode || 400, error.message);
    }
  },
  updateOne: async (table: string, id: string, data: any) => {
    const { str, arr } = upArgs(table, id, data);
    try {
      const row = await db.oneOrNone(str, arr);
      if (!row) {
        throw new ErrorResponse(404, 'Id not found');
      }
      return row;
    } catch (error) {
      throw new ErrorResponse(error.statusCode || 400, error.message);
    }
  },
  delOne: async (table: string, id: string) => {
    const { str, arr } = delArgs(table, id);
    try {
      const row = await db.oneOrNone(str, arr);
      if (!row) {
        throw new ErrorResponse(404, 'Id not found');
      }
      return row;
    } catch (error) {
      throw new ErrorResponse(error.statusCode || 400, error.message);
    }
  },
  login: async (data: any) => {
    const str =
      'SELECT _id,password,nick,user_type_id FROM users WHERE email=$1 AND active = true';

    try {
      const row = await db.oneOrNone(str, data.email);
      if (!row) {
        throw new ErrorResponse(400, 'Incorrect email/password');
      }
      const correctPass = await bcrypt.compare(data.password, row.password);
      if (!correctPass) {
        throw new ErrorResponse(400, 'Incorrect email/password');
      }
      return { token: getToken(row._id), id: row._id };
    } catch (error) {
      throw new ErrorResponse(error.statusCode || 400, error.message);
    }
  },
};
