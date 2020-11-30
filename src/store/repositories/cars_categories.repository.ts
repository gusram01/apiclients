import { Request } from 'express';
import { IDatabase, IMain } from 'pg-promise';
import { CarsCategories } from '../models/cars_categories';

export class CarsCategoriesRepository {
  private columns = '_id, cars_id, categories_id';
  private table = 'cars_categories';

  constructor(private db: IDatabase<any>, private pgp: IMain) {
    this.db = db;
    this.pgp = pgp;
  }

  getAll(req: Request): Promise<Partial<CarsCategories>[]> {
    return this.db.manyOrNone(`SELECT ${this.columns} FROM ${this.table}`);
  }

  getSome(req: Request): Promise<Partial<CarsCategories>[]> {
    const name = req.query.name;
    return this.db.manyOrNone(
      `SELECT ${this.columns} FROM ${this.table} WHERE name LIKE '${name}%'`
    );
  }

  oneById(req: Request): Promise<Partial<CarsCategories> | null> {
    const id = req.params.id;

    return this.db.oneOrNone(
      `SELECT ${this.columns} FROM ${this.table} WHERE _id = $1`,
      id
    );
  }

  async add(req: Request): Promise<Partial<CarsCategories>> {
    const { cars_id, categories_id } = req.body;
    return this.db.one(
      `INSERT INTO ${this.table} (cars_id, categories_id) VALUES($1, $2) RETURNING _id`,
      [cars_id, categories_id],
      (a) => ({ _id: a._id })
    );
  }

  updateById(req: Request): Promise<Partial<CarsCategories> | null> {
    const id = req.params.id;
    const { cars_id, categories_id } = req.body;
    return this.db.oneOrNone(
      `UPDATE ${this.table} SET cars_id = $1, categories_id = $2 WHERE _id = $3 RETURNING _id`,
      [cars_id, categories_id, id]
    );
  }

  deleteById(req: Request): Promise<Partial<CarsCategories> | null> {
    const id = req.params.id;
    return this.db.oneOrNone(
      `DELETE FROM ${this.table} WHERE _id = $1 RETURNING _id`,
      id
    );
  }
}
