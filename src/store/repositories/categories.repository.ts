import { IDatabase, IMain } from 'pg-promise';
import { Repository } from './repository';

export class CategoriesRepository extends Repository {
  protected columns: string[];

  constructor(db: IDatabase<any>, pgp: IMain) {
    super(db, pgp, 'categories');
    this.columns = ['_id', 'description'];
  }
}
