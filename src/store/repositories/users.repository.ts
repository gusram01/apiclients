import { Request } from 'express';
import { IDatabase, IMain } from 'pg-promise';
import { encrypter } from '../../utils/utilities';
import { Users } from '../models/users';
import { Repository } from './repository';

export class UsersRepository extends Repository {
  protected columns: string[];

  constructor(db: IDatabase<any>, pgp: IMain) {
    super(db, pgp, 'users');
    this.columns = ['_id', 'email', 'nick', 'roles_id'];
  }

  // getAll(req: Request): Promise<Partial<Users>[]> {
  //   return this.db.manyOrNone(
  //     `SELECT ${this.columns} FROM ${this.table} WHERE active = $<active>`,
  //     { active: true }
  //     //   id ? ' AND _id = $<id>' : ''
  //     // }`,
  //     // !id ? { active: true } : { id, active: true }
  //   );
  // }

  // getSome(req: Request): Promise<Partial<Users>[]> {
  //   const query = req.query;
  //   const id = req.params.id;
  //   const flag = Object.keys(query);
  //   const aux: any = { active: true };
  //   let str: string;

  //   if (flag.length > 0 && id) {
  //     str = ` AND ${flag
  //       .map((key) => key + " LIKE '" + query[key] + "%'")
  //       .join(' , ')} , _id = $<id>`;
  //     aux.id = id;
  //   } else if (flag.length > 0 && !id) {
  //     str = ` AND ${flag
  //       .map((key) => key + " LIKE '" + query[key] + "%'")
  //       .join(' , ')}`;
  //   } else if (flag.length === 0 && id) {
  //     str = ' AND _id = $<id>';
  //     aux.id = id;
  //   } else {
  //     str = '';
  //   }
  //   return this.db.manyOrNone(
  //     `SELECT _id, roles_id, nick, email, img_url, created_at FROM users WHERE active = $<active> ${str}`,
  //     flag.length === 0 ? aux : { ...query, ...aux }
  //   );
  // }

  // oneById(req: Request): Promise<Partial<Users>> {
  //   const id = req.params.id;
  //   return this.db.one(
  //     'SELECT _id,email,nick, roles_id FROM users WHERE active = $<active> AND _id = $<id>',
  //     { id, active: true }
  //   );
  // }

  async add(req: Request): Promise<Partial<Users>> {
    const newUser = {
      ...req.body,
      password: await encrypter(req.body.password),
      active: true,
      roles_id: 1,
    };
    delete newUser._id;

    return this.db.one(
      `INSERT INTO ${this.table} (${Object.keys(newUser).join(
        ' , '
      )}) VALUES(${Object.keys(newUser)
        .map((key: string) => '$<' + key + '>')
        .join(' , ')}) RETURNING _id, email, roles_id`,
      newUser,
      (a) => ({ _id: a._id, email: a.email, roles_id: a.roles_id })
    );
  }

  updateById(req: Request): Promise<Partial<Users>> {
    const id = req.params.id;
    const updatedData = { ...req.body };
    delete updatedData._id;
    delete updatedData.password;
    delete updatedData.active;
    delete updatedData.created_at;

    return this.db.one(
      `UPDATE users SET ${Object.keys(updatedData).map(
        (key) => key + ' = $<' + key + '>'
      )} , updated_at = $<updated_at> WHERE _id = $<id> AND active = $<active> RETURNING _id`,
      { ...updatedData, updated_at: 'NOW()', active: true, id }
    );
  }

  deleteById(req: Request): Promise<Partial<Users>> {
    const id = req.params.id;
    return this.db.one(
      'UPDATE users SET active = $<active>, updated_at = $<updated_at>, email_e = email , email = null WHERE _id = $<id> AND active = true RETURNING _id, updated_at as deleted_at',
      { updated_at: 'NOW()', active: false, id }
    );
  }

  isValid(item: {
    key: string;
    value: string;
  }): Promise<Partial<Users> | null> {
    return this.db.one(
      `SELECT email, nick FROM users WHERE ${item.key}=$1 AND active = $2`,
      [item.value, true]
    );
  }

  login(req: Request): Promise<Partial<Users> | null> {
    const { email } = req.body;
    return this.db.one(
      'SELECT _id,email,password,nick,roles_id FROM users WHERE email=$1 AND active = true',
      email
    );
  }
}
