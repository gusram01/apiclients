import pgPromise, { IInitOptions, IMain, QueryFile } from 'pg-promise';
import { ErrorResponse } from '../utils/ErrorResponse';
import { IDatabase } from 'pg-promise';
import {
  IExtensions,
  CarsRepository,
  CarsCategoriesRepository,
  CarsCustomersRepository,
  UsersCustomersRepository,
  CustomersRepository,
  BrandsRepository,
  CategoriesRepository,
  ModelsRepository,
  RolesRepository,
  UsersRepository,
  VersionsRepository,
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
    db.customers = new CustomersRepository(db, pgp);
    db.brands = new BrandsRepository(db, pgp);
    db.categories = new CategoriesRepository(db, pgp);
    db.models = new ModelsRepository(db, pgp);
    db.roles = new RolesRepository(db, pgp);
    db.users = new UsersRepository(db, pgp);
    db.versions = new VersionsRepository(db, pgp);
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
