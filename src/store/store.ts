import db from './database';
import { ErrorResponse } from '../utils/ErrorResponse';
import { encrypter, validateInputs } from '../utils/utilities';

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

export const store = (table: any) => {
  return {
    getAll: async () => {
      try {
        return await db.manyOrNone(`SELECT * from ${table}`);
      } catch (error) {
        throw new ErrorResponse(400, error.message);
      }
    },
    getOne: (id: string) => {},
    newUser: async (user: any) => {
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
    updateUser: (id: string, user: any) => {},
    delUser: (id: string) => {},
    findId: (id: string) => {},
    login: (id: string) => {},
  };
};
