import { Request } from 'express';
import { IDatabase, IMain } from 'pg-promise';
import { Customers } from '../models/customers';
import { Repository } from './repository';

export class CustomersRepository extends Repository {
  protected columns: string[];

  constructor(db: IDatabase<any>, pgp: IMain) {
    super(db, pgp, 'customers');
    this.columns = [
      '_id',
      'curp',
      'firstname',
      'lastname',
      'mobile',
      'phone',
      'gender',
      'email',
    ];
  }

  // async add(req: Request): Promise<Partial<Customers>> {
  //   const newCustomer = {
  //     ...req.body,
  //     active: true,
  //   };
  //   delete newCustomer._id;

  //   return this.db.one(
  //     `INSERT INTO ${this.table} (${Object.keys(newCustomer).join(
  //       ' , '
  //     )}) VALUES(${Object.keys(newCustomer)
  //       .map((key: string) => '$<' + key + '>')
  //       .join(' , ')}) RETURNING _id, curp`,
  //     newCustomer,
  //     (a) => ({ _id: a._id, curp: a.curp })
  //   );
  // }

  // updateById(req: Request): Promise<Partial<Customers>> {
  //   const id = req.params.id;
  //   const data = { ...req.body };
  //   delete data._id;
  //   delete data.active;
  //   delete data.curp;
  //   delete data.created_at;

  //   return this.db.one(
  //     `UPDATE ${this.table} SET ${Object.keys(data).map(
  //       (key) => key + ' = $<' + key + '>'
  //     )} , updated_at = $<updated_at> WHERE _id = $<id> AND active = $<active> RETURNING _id`,
  //     { ...data, updated_at: 'NOW()', active: true, id }
  //   );
  // }

  // deleteById(req: Request): Promise<Partial<Customers>> {
  //   const id = req.params.id;

  //   return this.db.one(
  //     `UPDATE ${this.table} SET active = $<active>, updated_at = $<updated_at>, email_e = email , email = null WHERE _id = $<id> AND active = true RETURNING _id, updated_at as deleted_at`,
  //     { updated_at: 'NOW()', active: false, id }
  //   );
  // }
}
