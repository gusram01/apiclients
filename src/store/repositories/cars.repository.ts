import { Request } from 'express';
import { IDatabase, IMain } from 'pg-promise';
import { Cars } from '../models/cars';
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

  getAll(req: Request): Promise<Partial<Cars>[]> {
    return this.db.manyOrNone(
      `SELECT c._id, price, b.description as brand, m.description as
       model, v.description as version
       FROM cars as c
       JOIN brands as b ON c.brands_id = b._id
       JOIN models as m ON c.models_id = m._id
       JOIN versions as v ON c.versions_id = v._id
       WHERE c.active = $<active>`,
      { active: true }
    );
  }

  getSome(req: Request): Promise<Partial<Cars>[]> {
    const query = req.query;
    const flag = Object.keys(query);
    let str: string;

    if (flag.length > 0) {
      str = ` WHERE ${flag
        .map((key) => 'c.' + key + " LIKE '%" + query[key] + "%'")
        .join(' , ')} AND c.active = $<active>`;
    } else {
      str = ' WHERE c.active = $<active>';
    }

    return this.db.manyOrNone(
      `SELECT c._id, c.price, c.description as car_description, b.description as brand, m.description as
       model, v.description as version
       FROM cars as c
       JOIN brands as b ON c.brands_id = b._id
       JOIN models as m ON c.models_id = m._id
       JOIN versions as v ON c.versions_id = v._id ${str}`,
      flag.length > 0 ? { ...query, active: true } : { active: true }
    );
  }

  async add(req: Request): Promise<Partial<Cars>> {
    const newCar = {
      ...req.body,
      active: true,
      description: req.body.description.toUpperCase(),
    };
    delete newCar._id;

    return this.db.one(
      `INSERT INTO ${this.table} (${Object.keys(newCar).join(
        ' , '
      )}) VALUES(${Object.keys(newCar)
        .map((key: string) => '$<' + key + '>')
        .join(' , ')}) RETURNING _id,description, price`,
      newCar,
      (a) => ({ _id: a._id, price: a.price })
    );
  }
}
