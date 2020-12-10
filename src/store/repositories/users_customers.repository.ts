import { IDatabase, IMain } from 'pg-promise';
import { UsersCustomers } from '../models/users_customers';
import { MyConditions } from '.';
import { Repository } from './repository';

export class UsersCustomersRepository extends Repository {
  protected columns: string[];

  constructor(db: IDatabase<any>, pgp: IMain) {
    super(db, pgp, 'users_customers');
    this.columns = ['_id', 'users_id', 'customers_id'];
  }
  customersByUser(user_id: string, query?: MyConditions) {
    let str = '';

    if (query && Object.keys(query).length > 0) {
      str = `AND ${Object.keys(query)
        .map((key) => {
          return key.includes('active')
            ? 'customers.' + key + ' = $<' + key + '>'
            : 'customers.' + key + " LIKE '%" + query[key] + "%'";
        })
        .join(' AND ')}`;
    }
    return this.db.manyOrNone(
      `SELECT ${this.table}._id, users._id as userID, 
       users.email as username,
       customers._id as clientID,
       customers.firstname as firstname,
       customers.lastname as lastname,
       customers.curp as CURP,
       customers.mobile as mobile,
       customers.email as email
       FROM ${this.table}
       RIGHT JOIN users ON ${this.table}.users_id = users._id
       RIGHT JOIN customers ON ${this.table}.customers_id = customers._id
       WHERE ${this.table}.users_id = $<user_id>
       ${str}`,
      !query ? { user_id } : { user_id, ...query }
    );
  }
  customersById(user_id: string, client_id: string) {
    return this.db.manyOrNone(
      `SELECT ${this.table}._id, users._id as userID, 
       users.email as username,
       customers._id as clientID,
       customers.firstname as firstname,
       customers.lastname as lastname,
       customers.curp as CURP,
       customers.mobile as mobile,
       customers.email as email
       FROM ${this.table}
       RIGHT JOIN users ON ${this.table}.users_id = users._id
       RIGHT JOIN customers ON ${this.table}.customers_id = customers._id
       WHERE ${this.table}.users_id = $<user_id>
       AND ${this.table}.customers_id = $<client_id>
       AND customers.active = true`,
      { user_id, client_id }
    );
  }

  find(query?: MyConditions): Promise<Partial<UsersCustomers>[]> {
    let str = '';

    if (query && Object.keys(query).length > 0) {
      str = `WHERE ${Object.keys(query)
        .map((key) => {
          return key.includes('active')
            ? key + ' = $<' + key + '>'
            : key + " LIKE '%" + query[key] + "%'";
        })
        .join(' AND ')}`;
    }
    return this.db.many(
      `SELECT ${this.table}._id, users._id as userID, 
       users.email as username,
       customers._id as clientID,
       customers.firstname as firstname,
       customers.lastname as lastname,
       customers.curp as CURP
       FROM ${this.table}
       JOIN users ON ${this.table}.users_id = users._id
       JOIN customers ON ${this.table}.customers_id = customers._id
       ${str}`,
      !query ? {} : query
    );
  }

  findById(id: string): Promise<Partial<UsersCustomers>[]> {
    return this.db.many(
      `SELECT ${this.table}._id, users._id as userID, 
       users.email as username,
       customers._id as clientID,
       customers.firstname as firstname,
       customers.lastname as lastname,
       customers.curp as CURP
       FROM ${this.table}
       JOIN users ON ${this.table}.users_id = users._id
       JOIN customers ON ${this.table}.customers_id = customers._id
       WHERE _id = $1`,
      id
    );
  }

  // async add(req: Request): Promise<Partial<UsersCustomers>> {
  //   const { users_id, customers_id } = req.body;
  //   return this.db.one(
  //     `INSERT INTO ${this.table} (users_id, customers_id) VALUES($<users_id>, $<customers_id>) RETURNING _id`,
  //     { users_id, customers_id },
  //     (a) => ({ _id: a._id })
  //   );
  // }

  // updateById(req: Request): Promise<Partial<UsersCustomers> | null> {
  //   const id = req.params.id;
  //   const { users_id, customers_id } = req.body;
  //   return this.db.one(
  //     `UPDATE ${this.table} SET users_id = $1, customers_id = $2 WHERE _id = $3 RETURNING _id`,
  //     [users_id, customers_id, id]
  //   );
  // }
}
