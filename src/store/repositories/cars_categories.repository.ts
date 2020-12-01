import { Request } from 'express';
import { IDatabase, IMain } from 'pg-promise';
import { CarsCategories } from '../models/cars_categories';
import { Repository } from './repository';

export class CarsCategoriesRepository extends Repository {
  protected columns = ['_id', 'cars_id', 'categories_id'];

  constructor(db: IDatabase<any>, pgp: IMain) {
    super(db, pgp, 'cars_categories');
    this.columns = ['_id', 'cars_id', 'categories_id'];
  }

  getAll(req: Request): Promise<Partial<CarsCategories>[]> {
    return this.db.many(
      `SELECT c._id, cars.description as car, cat.description as
       category
       FROM cars_categories as c
       JOIN cars ON c.cars_id = cars._id
       JOIN categories as cat ON c.categories_id = cat._id
       GROUP BY category`
    );
  }

  getSome(req: Request): Promise<Partial<CarsCategories>[]> {
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
      `SELECT c._id, cars.description as car, cat.description as
       category
       FROM cars_categories as c
       JOIN cars ON c.cars_id = cars._id
       JOIN categories as cat ON c.categories_id = cat._id
       GROUP BY category
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

  async add(req: Request): Promise<Partial<CarsCategories>> {
    const { cars_id, categories_id } = req.body;
    return this.db.one(
      `INSERT INTO ${this.table} (cars_id, categories_id) VALUES($<cars_id>, $<categories_id>) RETURNING _id`,
      { cars_id, categories_id },
      (a) => ({ _id: a._id })
    );
  }

  updateById(req: Request): Promise<Partial<CarsCategories> | null> {
    const id = req.params.id;
    const { cars_id, categories_id } = req.body;
    return this.db.one(
      `UPDATE ${this.table} SET cars_id = $1, categories_id = $2 WHERE _id = $3 RETURNING _id`,
      [cars_id, categories_id, id]
    );
  }

  deleteById(req: Request): Promise<Partial<CarsCategories> | null> {
    const id = req.params.id;
    return this.db.one(
      `DELETE FROM ${this.table} WHERE _id = $1 RETURNING _id`,
      id
    );
  }
}
