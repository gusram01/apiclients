import { Request } from 'express';
import { IDatabase, IMain } from 'pg-promise';
import { MyConditions } from '.';
import { CarsCategories } from '../models/cars_categories';

export class CarsCategoriesRepository {
  private columns = ['_id', 'cars_id', 'categories_id'];
  private table = 'cars_categories';

  constructor(private db: IDatabase<any>, private pgp: IMain) {}

  find(query?: MyConditions): Promise<Partial<CarsCategories>[]> {
    let str = '';
    if (query && Object.keys(query).length > 0) {
      str = `WHERE ${Object.keys(query)
        .map((key) => {
          return key + " LIKE '%" + query[key] + "%'";
        })
        .join(' AND ')}`;
    }
    return this.db.many(
      `SELECT ${this.table}._id, cars.description as car,
       categories.description as category
       FROM ${this.table}
       JOIN cars ON ${this.table}.cars_id = cars._id
       JOIN categories ON ${this.table}.categories_id = categories._id ${str}`,
      !query ? {} : query
    );
  }

  findById(id: string): Promise<any | null> {
    return this.db.one(
      `SELECT ${this.table}._id, cars.description as car,
      categories.description as category
      FROM ${this.table}
      JOIN cars ON ${this.table}.cars_id = cars._id
      JOIN categories ON ${this.table}.categories_id = categories._id
      WHERE ${this.table}._id = $1`,
      id
    );
  }

  // async add(req: Request): Promise<Partial<CarsCategories>> {
  //   const { cars_id, categories_id } = req.body;
  //   return this.db.one(
  //     `INSERT INTO ${this.table} (cars_id, categories_id) VALUES($<cars_id>, $<categories_id>) RETURNING _id`,
  //     { cars_id, categories_id },
  //     (a) => ({ _id: a._id })
  //   );
  // }

  // updateById(req: Request): Promise<Partial<CarsCategories> | null> {
  //   const id = req.params.id;
  //   const { cars_id, categories_id } = req.body;
  //   return this.db.one(
  //     `UPDATE ${this.table} SET cars_id = $1, categories_id = $2 WHERE _id = $3 RETURNING _id`,
  //     [cars_id, categories_id, id]
  //   );
  // }

  deleteById(id: string): Promise<Partial<CarsCategories> | null> {
    return this.db.one(
      `DELETE FROM ${this.table} WHERE _id = $1 RETURNING _id`,
      id
    );
  }
}
