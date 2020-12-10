import { IDatabase, IMain } from 'pg-promise';
import { MyConditions } from '.';

export class Repository {
  protected columns = ['_id', 'created_at'];
  protected table: string;

  constructor(
    protected db: IDatabase<any>,
    protected pgp: IMain,
    table: string
  ) {
    this.db = db;
    this.pgp = pgp;
    this.table = table;
  }

  find(query?: MyConditions) {
    let str = '';
    if (query && Object.keys(query).length > 0) {
      str = `WHERE ${Object.keys(query)
        .map((key) => key + ' = $<' + key + '>')
        .join(' AND ')}`;
    }

    return this.db.many(
      `SELECT ${this.columns.join(' , ')} FROM ${this.table} ${str}`,
      !query ? {} : query
    );
  }

  findById(id: string) {
    return this.db.one(
      `SELECT ${this.columns.join(' , ')} FROM ${this.table} WHERE _id = $1`,
      id
    );
  }

  create(data: MyConditions) {
    const keys = Object.keys(data);
    return this.db.one(
      `INSERT INTO ${this.table} (${keys.join(' , ')}) VALUES(${keys
        .map((key: string) => '$<' + key + '>')
        .join(' , ')}) RETURNING ${this.columns.join(' , ')}`,
      data
    );
  }

  update(data: MyConditions, id: string) {
    const keys = Object.keys(data);
    return this.db.one(
      `UPDATE ${this.table} SET (${keys
        .map((key) => key + ' = $<' + key + '>')
        .join(' , ')}) VALUES(${keys
        .map((key: string) => '$<' + key + '>')
        .join(' , ')}) WHERE _id = $<id> RETURNING _id`,
      { ...data, id }
    );
  }

  destroy(id: string) {
    return this.db.one(
      `DELETE FROM ${this.table} WHERE _id = $1 RETURNING _id`,
      id
    );
  }

  // deleteById(id: string) {
  //   return this.db.one(
  //     `UPDATE ${this.table} SET active = $<active>, updated_at = $<updated_at> WHERE _id = $<id> RETURNING _id, updated_at as deleted_at`,
  //     { updated_at: 'NOW()', active: false, id }
  //   );
  // }

  // getAll(req: Request): Promise<any[]> {
  //   return this.db.many(
  //     `SELECT ${this.columns.join(' , ')} FROM ${
  //       this.table
  //     } WHERE active = $<active>`,
  //     { active: true }
  //   );
  // }

  // getSome(req: Request): Promise<any[]> {
  //   const query = req.query;
  //   const flag = Object.keys(query);
  //   let str: string;

  //   if (flag.length > 0) {
  //     str = ` WHERE ${flag
  //       .map((key) => key + " LIKE '" + query[key] + "%'")
  //       .join(' , ')} AND active = $<active>`;
  //   } else {
  //     str = ' WHERE active = $<active>';
  //   }
  //   return this.db.many(
  //     `SELECT ${this.columns} FROM ${this.table} ${str}`,
  //     flag.length > 0 ? { ...query, active: true } : { active: true }
  //   );
  // }

  // oneById(req: Request): Promise<any | null> {
  //   const id = req.params.id;
  //   return this.db.one(
  //     `SELECT ${this.columns} FROM ${this.table} WHERE _id = $<id> AND active = $<active>`,
  //     { id, active: true }
  //   );
  // }

  // async add(req: Request): Promise<any | null> {
  //   const data = {
  //     ...req.body,
  //   };
  //   delete data._id;

  //   return this.db.one(
  //     `INSERT INTO ${this.table} (${Object.keys(data).join(
  //       ' , '
  //     )}) VALUES(${Object.keys(data)
  //       .map((key: string) => '$<' + key + '>')
  //       .join(' , ')}) RETURNING ${this.columns
  //       .filter((item) => item !== 'password')
  //       .join(' , ')}`,
  //     data
  //   );
  // }

  // updateById(req: Request): Promise<any> {
  //   const id = req.params.id;
  //   const data = { ...req.body };
  //   delete data._id;
  //   delete data.active;
  //   delete data.created_at;

  //   return this.db.one(
  //     `UPDATE ${this.table} SET ${Object.keys(data).map(
  //       (key) => key + ' = $<' + key + '>'
  //     )} , updated_at = $<updated_at> WHERE _id = $<id> AND active = $<active> RETURNING _id`,
  //     { ...data, updated_at: 'NOW()', active: true, id }
  //   );
  // }
}
