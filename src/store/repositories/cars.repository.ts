import { IDatabase, IMain } from 'pg-promise';
import { Cars } from '../models/cars';
import { MyConditions } from '.';
import { Repository } from './repository';

export class CarsRepository extends Repository {
  protected columns: string[];

  constructor(db: IDatabase<any>, pgp: IMain) {
    super(db, pgp, 'cars');
    this.columns = [
      '_id',
      'brands_id',
      'models_id',
      'versions_id',
      'price',
      'description',
      'created_at',
    ];
  }

  findById(id: string): Promise<Partial<Cars>[]> {
    return this.db.one(
      `SELECT ${this.table}._id, ${this.table}.price, 
        ${this.table}.description as car_description, 
        brands.description as brand, models.description as 
        model, versions.description as version 
        FROM ${this.table} 
        JOIN brands ON ${this.table}.brands_id = brands._id 
        JOIN models ON ${this.table}.models_id = models._id 
        JOIN versions ON ${this.table}.versions_id = versions._id 
        WHERE ${this.table}._id = $1`,
      id
    );
  }

  find(query?: MyConditions): Promise<Partial<Cars>[]> {
    let str = '';
    if (query && Object.keys(query).length > 0) {
      str = `WHERE ${Object.keys(query)
        .map((key) => {
          return key === 'active'
            ? 'cars.' + key + ' = $<' + key + '>'
            : 'cars.' + key + " LIKE '%" + query[key] + "%'";
        })
        .join(' AND ')}`;
    }

    return this.db.many(
      `SELECT ${this.table}._id, ${this.table}.price, ${this.table}.year,
       ${this.table}.description as description,
       brands.description as brand, models.description as
       model, versions.description as version
       FROM ${this.table}
       JOIN brands ON ${this.table}.brands_id = brands._id
       JOIN models ON ${this.table}.models_id = models._id
       JOIN versions ON ${this.table}.versions_id = versions._id ${str}`,
      !query ? {} : query
    );
  }
}
