import db from './database';
import { ErrorResponse } from '../utils/ErrorResponse';
import { encrypter, validateInputs } from '../utils/utilities';
import { IStore } from './interfaces/store';

export const store: IStore = {
  getAll: async (table: string) => {
    try {
      return await db.manyOrNone(`SELECT * from ${table}`);
    } catch (error) {
      throw new ErrorResponse(400, error.message);
    }
  },
  getOne: (table: string, id: string) => {},
  newUser: async (table: string, user: any) => {
    if (!validateInputs('newUser', user)) {
      throw new ErrorResponse(400, 'Please Verify your Request');
    }
    const { nick, email, password } = user;
    try {
      const securedPass = await encrypter(password);
      return await db.oneOrNone(
        `INSERT INTO ${table} (nick, email, user_password, user_type_id) VALUES ($1, $2, $3, $4) RETURNING _id`,
        [nick, email, securedPass, 1]
      );
    } catch (error) {
      throw new ErrorResponse(400, error.message);
    }
  },
  updateUser: (table: string, id: string, user: any) => {},
  delUser: (table: string, id: string) => {},
  findId: (table: string, id: string) => {},
  login: (table: string, id: string) => {},
};
