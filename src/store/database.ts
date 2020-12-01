import pgPromise, { IInitOptions, IMain, QueryFile } from 'pg-promise';
import { ErrorResponse } from '../utils/ErrorResponse';
import { IDatabase } from 'pg-promise';
import {
  IExtensions,
  UsersRepository,
  CustomersRepository,
  CarsRepository,
  CategoriesRepository,
  VersionsRepository,
  ModelsRepository,
  BrandsRepository,
  RolesRepository,
  CarsCategoriesRepository,
} from './repositories';

type ExtendedProtocol = IDatabase<IExtensions> & IExtensions;

const connectionString = process.env.POSTG1 as string;
const initOptions: IInitOptions<IExtensions> = {
  connect(client, dc, useCount) {
    const cp = client.connectionParameters;
    console.log('DB Online', useCount);
  },
  extend(obj: ExtendedProtocol, dc: any) {
    obj.users = new UsersRepository(obj, pgp);
    obj.customers = new CustomersRepository(obj, pgp);
    obj.cars = new CarsRepository(obj, pgp);
    obj.categories = new CategoriesRepository(obj, pgp);
    obj.versions = new VersionsRepository(obj, pgp);
    obj.models = new ModelsRepository(obj, pgp);
    obj.brands = new BrandsRepository(obj, pgp);
    obj.roles = new RolesRepository(obj, pgp);
    obj.cars_categories = new CarsCategoriesRepository(obj, pgp);
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
