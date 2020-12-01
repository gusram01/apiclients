import { Request } from 'express';
import { IDatabase, IMain } from 'pg-promise';
import { CarsCustomers } from '../models/cars_customers';
import { Repository } from './repository';

export class CarsCustomersRepository extends Repository {
  protected columns = ['_id', 'cars_id', 'customers_id'];

  constructor(db: IDatabase<any>, pgp: IMain) {
    super(db, pgp, 'cars_customers');
    this.columns = ['_id', 'cars_id', 'customers_id'];
  }

  getAll(req: Request): Promise<Partial<CarsCustomers>[]> {
    return this.db.many(
      `SELECT c._id, cars.description as car,
       customers._id as clientID,
       customers.firstname as firstname,
       customers.lastname as lastname,
       customers.curp as CURP
       FROM cars_customers as c
       JOIN cars ON c.cars_id = cars._id
       JOIN customers ON c.customers_id = customers._id
       GROUP BY CURP`
    );
  }

  getSome(req: Request): Promise<Partial<CarsCustomers>[]> {
    const query = req.query;
    const flag = Object.keys(query);
    let str: string;

    if (flag.length > 0) {
      str = ` WHERE ${flag
        .map((key) => key + " LIKE '%" + query[key] + "%'")
        .join(' , ')}`;
    } else {
      str = '';
    }
    return this.db.many(
      `SELECT c._id, cars.description as car,
       customers._id as clientID,
       customers.firstname as firstname,
       customers.lastname as lastname,
       customers.curp as CURP
       FROM cars_customers as c
       JOIN cars ON c.cars_id = cars._id
       JOIN customers ON c.customers_id = customers._id
       GROUP BY CURP
       ${str}`,
      flag.length > 0 ? { ...query } : {}
    );
  }

  oneById(req: Request): Promise<any | null> {
    const id = req.params.id;
    return this.db.one(
      `SELECT ${this.columns} FROM ${this.table} WHERE _id = $1`,
      id
    );
  }

  async add(req: Request): Promise<Partial<CarsCustomers>> {
    const { cars_id, customers_id } = req.body;
    return this.db.one(
      `INSERT INTO ${this.table} (cars_id, customers_id) VALUES($<cars_id>, $<customers_id>) RETURNING _id`,
      { cars_id, customers_id },
      (a) => ({ _id: a._id })
    );
  }

  updateById(req: Request): Promise<Partial<CarsCustomers> | null> {
    const id = req.params.id;
    const { cars_id, customers_id } = req.body;
    return this.db.one(
      `UPDATE ${this.table} SET cars_id = $1, customers_id = $2 WHERE _id = $3 RETURNING _id`,
      [cars_id, customers_id, id]
    );
  }

  deleteById(req: Request): Promise<Partial<CarsCustomers> | null> {
    const id = req.params.id;
    return this.db.one(
      `DELETE FROM ${this.table} WHERE _id = $1 RETURNING _id`,
      id
    );
  }
}
