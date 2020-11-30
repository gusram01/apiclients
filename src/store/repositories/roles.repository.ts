import { IDatabase, IMain } from 'pg-promise';
import { Repository } from './repository';

export class RolesRepository extends Repository {
  protected columns: string[];

  constructor(db: IDatabase<any>, pgp: IMain) {
    super(db, pgp, 'roles');
    this.columns = ['_id', 'description'];
  }
}
