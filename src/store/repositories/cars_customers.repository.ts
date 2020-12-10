import { IDatabase, IMain } from 'pg-promise';
import { CarsCustomers } from '../models/cars_customers';
import { MyConditions } from '.';
import { Repository } from './repository';

export class CarsCustomersRepository extends Repository {
  protected columns: string[];

  constructor(db: IDatabase<any>, pgp: IMain) {
    super(db, pgp, 'cars_customers');
    this.columns = ['_id', 'cars_id', 'customers_id'];
  }

  find(query?: MyConditions): Promise<Partial<CarsCustomers>[]> {
    let str = '';
    if (query && Object.keys(query).length > 0) {
      str = `WHERE ${Object.keys(query)
        .map((key) => {
          return key === 'active'
            ? key + ' = $<' + key + '>'
            : key + " LIKE '%" + query[key] + "%'";
        })
        .join(' AND ')}`;
    }

    return this.db.many(
      `SELECT cars_customers._id, cars.description as car,
       customers._id as clientID,
       customers.firstname as firstname,
       customers.lastname as lastname,
       customers.curp as CURP
       FROM cars_customers
       JOIN cars ON cars_customers.cars_id = cars._id
       JOIN customers ON cars_customers.customers_id = customers._id
       ${str}`,
      !query ? {} : query
    );
  }

  findById(id: string): Promise<any | null> {
    return this.db.one(
      `SELECT cars_customers._id, cars.description as car,
       customers._id as clientID,
       customers.firstname as firstname,
       customers.lastname as lastname,
       customers.curp as CURP
       FROM cars_customers
       JOIN cars ON cars_customers.cars_id = cars._id
       JOIN customers ON cars_customers.customers_id = customers._id
       WHERE _id = $1`,
      id
    );
  }
}
