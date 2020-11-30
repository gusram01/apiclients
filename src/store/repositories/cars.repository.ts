import { Request } from 'express';
import { IDatabase, IMain } from 'pg-promise';
import { Cars } from '../models/cars';

export class CarsRepository {
  private columns = '_id, brands_id, models_id, versions_id, price, created_at';

  constructor(private db: IDatabase<any>, private pgp: IMain) {
    this.db = db;
    this.pgp = pgp;
  }

  getAll(req: Request): Promise<Partial<Cars>[]> {
    return this.db.manyOrNone(
      `SELECT ${this.columns} FROM cars WHERE active = $<active>`,
      { active: true }
    );
  }

  getSome(req: Request): Promise<Partial<Cars>[]> {
    const query = req.query;
    return this.db.manyOrNone(
      `SELECT ${this.columns} FROM cars WHERE active = $<active> ${
        !query
          ? ''
          : ' AND ' +
            Object.keys(query).map((key) => key + " LIKE '" + query[key] + "%'")
      }`,
      { active: true }
    );
  }

  oneById(req: Request): Promise<Partial<Cars>> {
    const id = req.params.id;

    return this.db.one(
      `SELECT ${this.columns} FROM cars WHERE active = $<active> AND _id = $<id>`,
      { id, active: true }
    );
  }

  async add(req: Request): Promise<Partial<Cars>> {
    const car = req.body;
    const newCar = {
      ...car,
      active: true,
    };
    delete newCar._id;

    return this.db.one(
      `INSERT INTO cars (${Object.keys(newCar).join(
        ' , '
      )}) VALUES(${Object.keys(newCar)
        .map((key: string) => '$<' + key + '>')
        .join(' , ')}) RETURNING _id, price`,
      newCar,
      (a) => ({ _id: a._id, price: a.price })
    );
  }

  updateById(req: Request): Promise<Partial<Cars>> {
    const id = req.params.id;
    const data = req.body;
    const updatedData = { ...data };

    delete updatedData._id;
    delete updatedData.active;
    delete updatedData.created_at;

    return this.db.one(
      `UPDATE cars SET ${Object.keys(updatedData).map(
        (key) => key + ' = $<' + key + '>'
      )} , updated_at = $<updated_at> WHERE _id = $<id> AND active = $<active> RETURNING _id`,
      { ...updatedData, updated_at: 'NOW()', active: true, id }
    );
  }

  deleteById(req: Request): Promise<Partial<Cars>> {
    const id = req.params.id;
    return this.db.one(
      'UPDATE cars SET active = $<active>, updated_at = $<updated_at>, email_e = email , email = null WHERE _id = $<id> AND active = true RETURNING _id, updated_at as deleted_at',
      { updated_at: 'NOW()', active: false, id }
    );
  }
}
