import { Request } from 'express';
import { IDatabase, IMain } from 'pg-promise';
import { CarsCustomers } from '../models/cars_customers';
import { MyConditions } from '.';

export class CarsCustomersRepository {
  private columns = ['_id', 'cars_id', 'customers_id'];
  private table = 'cars_customers';
  constructor(private db: IDatabase<any>, private pgp: IMain) {}

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

  // async add(req: Request): Promise<Partial<CarsCustomers>> {
  //   const { cars_id, customers_id } = req.body;
  //   return this.db.one(
  //     `INSERT INTO ${this.table} (cars_id, customers_id) VALUES($<cars_id>, $<customers_id>) RETURNING _id`,
  //     { cars_id, customers_id },
  //     (a) => ({ _id: a._id })
  //   );
  // }

  // updateById(req: Request): Promise<Partial<CarsCustomers> | null> {
  //   const id = req.params.id;
  //   const { cars_id, customers_id } = req.body;
  //   return this.db.one(
  //     `UPDATE ${this.table} SET cars_id = $1, customers_id = $2 WHERE _id = $3 RETURNING _id`,
  //     [cars_id, customers_id, id]
  //   );
  // }

  deleteById(id: string): Promise<Partial<CarsCustomers> | null> {
    return this.db.one(
      `DELETE FROM ${this.table} WHERE _id = $1 RETURNING _id`,
      id
    );
  }
}
