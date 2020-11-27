import { Request } from 'express';
import bcrypt from 'bcrypt';
import db from './database';
import { ErrorResponse } from '../utils/ErrorResponse';
import {
  allArgs,
  delArgs,
  getString,
  newArgs,
  oneArgs,
  someArgs,
  upArgs,
} from './getStrings';
import { encrypter, getToken } from '../utils/utilities';
import { IStore } from './interfaces/store';

const getAll = (req: Request) => {
  const str = allArgs(req);
  // try {
  //   const rows = await db.manyOrNone(str);
  //   return rows;
  // } catch (error) {
  //   throw new ErrorResponse(error.statusCode || 400, error.message);
  // }
  return db.manyOrNone(str);
  // .then((data) => data)
  // .catch((err) => {
  //   throw new ErrorResponse(err.statusCode || 400, err.message);
  // });
};

const getOne = async (req: Request) => {
  const str = oneArgs(req);
  // try {
  //   const row = await db.oneOrNone(str, req.params.id);
  //   if (!row) {
  //     throw new ErrorResponse(404, 'Id not found');
  //   }
  //   return row;
  // } catch (error) {
  //   throw new ErrorResponse(error.statusCode || 400, error.message);
  // }
  return db.oneOrNone(str, req.params.id);
};

const getSome = async (req: Request) => {
  const { str, arr } = someArgs(req);
  // try {
  //   const rows = await db.manyOrNone(str, arr);
  //   if (!rows || rows.length === 0) {
  //     throw new ErrorResponse(404, 'Try with another info');
  //   }
  //   return rows;
  // } catch (error) {
  //   throw new ErrorResponse(error.statusCode || 400, error.message);
  // }
  return db.manyOrNone(str, arr);
};
const newOne = async (req: Request) => {
  if (req.params.table === 'login') {
    return login(req);
  }
  if (req.params.table === 'signup') {
    return signup(req);
  }
  try {
    const { str, arr } = await newArgs(req);
    const row = await db.oneOrNone(str, arr);
    return row;
  } catch (error) {
    throw new ErrorResponse(error.statusCode || 400, error.message);
  }
};

const updateOne = async (req: Request) => {
  const { str, arr } = upArgs(req.params.table, req.params.id, req.body);
  // try {
  //   const row = await db.oneOrNone(str, arr);
  //   if (!row) {
  //     throw new ErrorResponse(404, 'Id not found');
  //   }
  //   return row;
  // } catch (error) {
  //   throw new ErrorResponse(error.statusCode || 400, error.message);
  // }
  return db.oneOrNone(str, arr);
};
const delOne = async (req: Request) => {
  const { str, arr } = delArgs(req.params.table, req.params.id);
  // try {
  //   const row = await db.oneOrNone(str, conditions);
  //   if (!row) {
  //     throw new ErrorResponse(404, 'Id not found');
  //   }
  //   return row;
  // } catch (error) {
  //   throw new ErrorResponse(error.statusCode || 400, error.message);
  // }
  return db.oneOrNone(str, arr);
};

const login = async (req: Request) => {
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
};
const signup = async (req: Request) => {
  const { email, nick, password } = req.body;
  if (!nick || !email || !password) {
    throw new ErrorResponse(400, 'Please send username, email and password');
  }
  const str =
    'INSERT INTO users (email,password,nick,roles_id)' +
    'VALUES ($1,$2,$3,1)' +
    'RETURNING _id, email, nick, roles_id';
  try {
    const arr = [email, await encrypter(password), nick];
    const row = await db.oneOrNone(str, arr);
    if (!row) {
      throw new ErrorResponse(400, 'Try again');
    }

    return {
      token: getToken(row._id, row.email, row.roles_id.toString()),
      id: row._id,
    };
  } catch (error) {
    throw new ErrorResponse(error.statusCode || 400, error.message);
  }
};
const roles = async () => db.manyOrNone('SELECT * FROM roles');

export const store: IStore = {
  getAll,
  getOne,
  getSome,
  newOne,
  updateOne,
  delOne,
  roles,
};
