import pgPromise, { IInitOptions, IMain, QueryFile } from 'pg-promise';
import { ErrorResponse } from '../utils/ErrorResponse';
import { IDatabase } from 'pg-promise';
import {
  IExtensions,
  MyConditions,
  CarsRepository,
  CarsCategoriesRepository,
  CarsCustomersRepository,
  UsersCustomersRepository,
} from './repositories';

type ExtendedProtocol = IDatabase<IExtensions> & IExtensions;

const connectionString = process.env.POSTG1 as string;
const initOptions: IInitOptions<IExtensions> = {
  connect(client, dc, useCount) {
    const cp = client.connectionParameters;
    console.log('DB Online', useCount);
  },
  extend(db: ExtendedProtocol, dc: any) {
    db.cars = new CarsRepository(db, pgp);
    db.cars_categories = new CarsCategoriesRepository(db, pgp);
    db.cars_customers = new CarsCustomersRepository(db, pgp);
    db.users_customers = new UsersCustomersRepository(db, pgp);

    db.find = (
      table: string,
      query?: MyConditions,
      columns: string[] = ['*']
    ) => {
      let str = '';
      if (query && Object.keys(query).length > 0) {
        str = `WHERE ${Object.keys(query)
          .map((key) => key + ' = $<' + key + '>')
          .join(' AND ')}`;
      }
      if (table === 'users') {
        return db.manyOrNone(
          `SELECT ${columns.join(' , ')} FROM ${table} ${str}`,
          !query ? {} : query
        );
      }
      return db.many(
        `SELECT ${columns.join(' , ')} FROM ${table} ${str}`,
        !query ? {} : query
      );
    };

    db.findById = (table: string, id: string, columns: string[] = ['*']) =>
      db.one(`SELECT ${columns.join(' , ')} FROM ${table} WHERE _id = $1`, id);

    db.create = (table: string, data: MyConditions, columns: string[] = []) => {
      const keys = Object.keys(data);
      return db.one(
        `INSERT INTO ${table} (${keys.join(' , ')}) VALUES(${keys
          .map((key: string) => '$<' + key + '>')
          .join(' , ')}) RETURNING ${
          columns.length > 0 ? columns.join(' , ') : '_id'
        }`,
        data
      );
    };

    db.update = (table: string, data: MyConditions, id: string) => {
      const keys = Object.keys(data);
      return db.one(
        `UPDATE ${table} SET (${keys
          .map((key) => key + ' = $<' + key + '>')
          .join(' , ')}) VALUES(${keys
          .map((key: string) => '$<' + key + '>')
          .join(' , ')}) WHERE _id = $<id> RETURNING _id`,
        { ...data, id }
      );
    };

    db.isValid = (item: { key: string; value: string }): Promise<any> =>
      db.oneOrNone(
        `SELECT email, nick FROM users WHERE ${item.key}=$1 AND active = $2`,
        [item.value, true]
      );
  },
};

const pgp: IMain = pgPromise(initOptions);
const db: ExtendedProtocol = pgp(connectionString);
// const qf = new QueryFile('file.sql', {
//   minify: true,
// });
// if (qf.error) {
//   throw new ErrorResponse(500, qf.error.message);
// }

// db.none(qf)
//   .then(() => console.log('DB ready'))
//   .catch(console.log);

export { db, pgp, ExtendedProtocol };
