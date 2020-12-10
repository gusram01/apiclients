import { IDatabase, IMain } from 'pg-promise';
import { Repository } from './repository';

export class BrandsRepository extends Repository {
  protected columns: string[];

  constructor(db: IDatabase<any>, pgp: IMain) {
    super(db, pgp, 'brands');
    this.columns = ['_id', 'description'];
  }
}
