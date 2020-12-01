import { Request } from 'express';
import { IDatabase, IMain } from 'pg-promise';
import { UsersCustomers } from '../models/users_customers';
import { Repository } from './repository';

export class UsersCustomersRepository extends Repository {
  protected columns = ['_id', 'users_id', 'customers_id'];

  constructor(db: IDatabase<any>, pgp: IMain) {
    super(db, pgp, 'users_customers');
    this.columns = ['_id', 'users_id', 'customers_id'];
  }

  getAll(req: Request): Promise<Partial<UsersCustomers>[]> {
    return this.db.many(
      `SELECT u._id, users._id as userID, 
       users.email as username,
       customers._id as clientID,
       customers.firstname as firstname,
       customers.lastname as lastname,
       customers.curp as CURP
       FROM users_customers as u
       JOIN users ON u.users_id = users._id
       JOIN customers ON u.customers_id = customers._id
       GROUP BY username`
    );
  }

  getSome(req: Request): Promise<Partial<UsersCustomers>[]> {
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
      `SELECT u._id, users._id as userID, 
       users.email as username,
       customers._id as clientID,
       customers.firstname as firstname,
       customers.lastname as lastname,
       customers.curp as CURP
       FROM users_customers as u
       JOIN users ON u.users_id = users._id
       JOIN customers ON u.customers_id = customers._id
       GROUP BY username
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

  async add(req: Request): Promise<Partial<UsersCustomers>> {
    const { users_id, customers_id } = req.body;
    return this.db.one(
      `INSERT INTO ${this.table} (users_id, customers_id) VALUES($<users_id>, $<customers_id>) RETURNING _id`,
      { users_id, customers_id },
      (a) => ({ _id: a._id })
    );
  }

  updateById(req: Request): Promise<Partial<UsersCustomers> | null> {
    const id = req.params.id;
    const { users_id, customers_id } = req.body;
    return this.db.one(
      `UPDATE ${this.table} SET users_id = $1, customers_id = $2 WHERE _id = $3 RETURNING _id`,
      [users_id, customers_id, id]
    );
  }

  deleteById(req: Request): Promise<Partial<UsersCustomers> | null> {
    const id = req.params.id;
    return this.db.one(
      `DELETE FROM ${this.table} WHERE _id = $1 RETURNING _id`,
      id
    );
  }
}
