import { IDatabase, IMain } from 'pg-promise';
import { Repository } from './repository';

export class VersionsRepository extends Repository {
  protected columns: string[];

  constructor(db: IDatabase<any>, pgp: IMain) {
    super(db, pgp, 'versions');
    this.columns = ['_id', 'description', 'models_id'];
  }
}
