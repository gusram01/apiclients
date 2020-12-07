import pgPromise, { IInitOptions, IMain, QueryFile } from 'pg-promise';
import { ErrorResponse } from '../utils/ErrorResponse';
import { IDatabase } from 'pg-promise';
import { IExtensions, MyConditions } from './repositories';

type ExtendedProtocol = IDatabase<IExtensions> & IExtensions;

const connectionString = process.env.POSTG1 as string;
const initOptions: IInitOptions<IExtensions> = {
  connect(client, dc, useCount) {
    const cp = client.connectionParameters;
    console.log('DB Online', useCount);
  },
  extend(db: ExtendedProtocol, dc: any) {
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
      db.one(
        `SELECT email, nick FROM users WHERE ${item.key}=$1 AND active = $2`,
        [item.value, true]
      );

    db.findCar = (query?: MyConditions) => {
      let str = '';
      if (query && Object.keys(query).length > 0) {
        str = `WHERE ${Object.keys(query)
          .map((key) => {
            return key === 'active'
              ? 'cars.' + key + ' = $<' + key + '>'
              : 'cars.' + key + " LIKE '%" + query[key] + "%'";
          })
          .join(' AND ')}`;
      }

      return db.many(
        `SELECT cars._id, cars.price, cars.year,
         cars.description as description,
         brands.description as brand, models.description as
         model, versions.description as version
         FROM cars
         JOIN brands ON cars.brands_id = brands._id
         JOIN models ON cars.models_id = models._id
         JOIN versions ON cars.versions_id = versions._id ${str}`,
        !query ? {} : query
      );
    };

    db.findCarById = (id: string) =>
      db.one(
        'SELECT cars._id, cars.price, ' +
          'cars.description as car_description, ' +
          'brands.description as brand, models.description as ' +
          'model, versions.description as version ' +
          'FROM cars ' +
          'JOIN brands ON cars.brands_id = brands._id ' +
          'JOIN models ON cars.models_id = models._id ' +
          'JOIN versions ON cars.versions_id = versions._id ' +
          'WHERE cars._id = $1 ',
        id
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
