import { IDatabase, IMain } from 'pg-promise';
import { Repository } from './repository';

export class ModelsRepository extends Repository {
  protected columns: string[];

  constructor(db: IDatabase<any>, pgp: IMain) {
    super(db, pgp, 'models');
    this.columns = ['_id', 'description', 'brands_id'];
  }
}
