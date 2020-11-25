import db from './database';
import bcrypt from 'bcrypt';
import { ErrorResponse } from '../utils/ErrorResponse';
import {
  allArgs,
  delArgs,
  newArgs,
  someArgs,
  upArgs,
  oneIdArgs,
} from './getStrings';
import { getToken } from '../utils/utilities';
import { IStore } from './interfaces/store';
import { Request } from 'express';

export const store: IStore = {
  roles: async () => {
    const str = 'SELECT * FROM roles';
    try {
      const rows = await db.manyOrNone(str);
      return rows;
    } catch (error) {
      throw new ErrorResponse(error.statusCode || 400, error.message);
    }
  },
  getAll: async (req: Request) => {
    const str = allArgs(req.params.table);
    try {
      const rows = await db.manyOrNone(str);
      return rows;
    } catch (error) {
      throw new ErrorResponse(error.statusCode || 400, error.message);
    }
  },
  getOne: async (req: Request) => {
    const { str, arr } = oneIdArgs(req.params.table, req.params.id);
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
  getSome: async (req: Request) => {
    const { str, arr } = someArgs(req.params.table, req.query);
    try {
      const rows = await db.manyOrNone(str, arr);
      if (!rows || rows.length === 0) {
        throw new ErrorResponse(404, 'Try with another info');
      }
      return rows;
    } catch (error) {
      throw new ErrorResponse(error.statusCode || 400, error.message);
    }
  },
  newOne: async (req: Request) => {
    try {
      const { str, arr } = await newArgs(req.params.table, req.body);
      const row = await db.oneOrNone(str, arr);
      if (req.params.table === 'users') {
        return {
          token: getToken(row._id, row.email, row.roles_id.toString()),
          id: row._id,
        };
      } else {
        return row;
      }
    } catch (error) {
      throw new ErrorResponse(error.statusCode || 400, error.message);
    }
  },
  updateOne: async (req: Request) => {
    const { str, arr } = upArgs(req.params.table, req.params.id, req.body);
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
  delOne: async (req: Request) => {
    const { str, arr } = delArgs(req.params.table, req.params.id);
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
  login: async (req: Request) => {
    const str =
      'SELECT _id,email,password,nick,roles_id FROM users WHERE email=$1 AND active = true';

    try {
      const row = await db.oneOrNone(str, req.body.email);
      if (!row) {
        throw new ErrorResponse(400, 'Incorrect email/password');
      }

      const correctPass = await bcrypt.compare(req.body.password, row.password);
      if (!correctPass) {
        throw new ErrorResponse(400, 'Incorrect email/password');
      }
      return {
        token: getToken(row._id, row.email, row.roles_id.toString()),
        id: row._id,
      };
    } catch (error) {
      throw new ErrorResponse(error.statusCode || 400, error.message);
    }
  },
};
