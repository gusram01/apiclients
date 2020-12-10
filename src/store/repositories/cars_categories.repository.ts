import { IDatabase, IMain } from 'pg-promise';
import { MyConditions } from '.';
import { CarsCategories } from '../models/cars_categories';
import { Repository } from './repository';

export class CarsCategoriesRepository extends Repository {
  protected columns: string[];

  constructor(db: IDatabase<any>, pgp: IMain) {
    super(db, pgp, 'cars_categories');
    this.columns = ['_id', 'cars_id', 'categories_id'];
  }

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
}
