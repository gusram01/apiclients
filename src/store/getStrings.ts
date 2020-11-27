import { Request } from 'express';
import { ErrorResponse } from '../utils/ErrorResponse';

interface DataRequest {
  [key: string]: string | number | boolean;
}

const getString = (req: Request) => {
  let str = '';
  const conditions: string[] = [];
  switch (req.method) {
    case 'GET':
      if (req.params.id) {
      }
      break;
    case 'POST':
      break;
    case 'PUT':
      break;
    case 'DELETE':
      break;
    default:
      throw new ErrorResponse(400, 'Try another HTTP method');
  }
  return { str, conditions };
};

const finalConditions = (req: Request) => {
  const flag = ['users', 'cars', 'customers'].includes(req.params.table);
  return flag ? ' WHERE active = true' : '';
};

const allArgs = (req: Request) => {
  //@ts-expect-error
  const { fields } = req.tabledescription;
  return `SELECT ${fields
    .filter((item: string) => item !== 'password')
    .join(', ')} FROM ${req.params.table} ${finalConditions(req)}`;
};
const oneArgs = (req: Request) => {
  //@ts-expect-error
  const { fields } = req.tabledescription;
  return `SELECT ${fields
    .filter((item: string) => item !== 'password')
    .join(', ')} FROM ${req.params.table} ${finalConditions(req)} AND _id=$1`;
};

const someArgs = (req: Request) => {
  //@ts-expect-error
  const { fields } = req.tabledescription;
  let arr: any[] = [];
  const data = { ...req.query };
  delete data.active;
  delete data.password;

  const conditions = Object.keys(data)
    .map((key, index) => {
      arr.push(data[key]);
      return `${key} = $${index + 1}`;
    })
    .join(', ');

  // const auxArr = Object.keys(auxData);
  // const valColumn = auxArr
  //   .map((key, index) => {
  //     arr.push(auxData[key]);
  //     return `${key} = $${index + 1}`;
  //   })
  //   .join(' AND ');
  const str = `SELECT ${fields.join(', ')} FROM ${req.params.table} ${
    arr.length > 0 ? 'WHERE ' + conditions : ''
  }`;
  // //@ts-expect-error
  // } ${access === 'self' ? ' AND users_id = ' + req.user.id : ''}`;

  return { str, arr };
};

const newArgs = async (req: Request) => {
  //@ts-expect-error
  const { fields } = req.tabledescription;
  const data = { ...req.body };

  const arr: any[] = [];

  const columns = Object.keys(data)
    .map((key) => {
      arr.push(data[key]);
      return key;
    })
    .join(', ');

  const str = `INSERT INTO ${req.params.table} (${columns}) VALUES (${arr.map(
    (item, index) => '$' + (index + 1)
  )}) RETURNING ${fields
    .filter((item: string) => item !== 'password')
    .join(', ')}`;

  return { str, arr };
};

const upArgs = (table: string, id: string, data: any) => {
  const auxData: any = {};
  Object.keys(data).map((key) => {
    if (
      key.trim() !== '_id' &&
      key.trim() !== 'active' &&
      key.trim() !== 'created_at' &&
      key.trim() !== 'password' &&
      key.trim() !== 'email' &&
      key.trim() !== 'birthdate' &&
      key.trim() !== ''
    ) {
      return (auxData[key] = data[key]);
    }
  });
  const valColumn = Object.keys(auxData)
    .map((key) => `${key}='${auxData[key]}'`)
    .join(',');
  const columns = Object.keys(auxData).join(',');
  // const what = limitForTable(table);

  const activeCond =
    table === 'users' || table === 'customers' || table === 'cars'
      ? 'AND active=true'
      : '';
  const arr = [id];
  const str = `UPDATE ${table} SET ${valColumn}, updated_at = NOW() WHERE _id=$1 ${activeCond} RETURNING _id,${columns}`;

  return { str, arr };
};
const delArgs = (table: string, id: string) => {
  // const what = limitForTable(table);

  const usersStr =
    table === 'users' || table === 'customers' || table === 'cars'
      ? 'AND active=true'
      : '';
  const str = `UPDATE ${table} SET active = false, updated_at = NOW() ${
    table === 'users' ? ',email_e=email,email=""' : ''
  } WHERE _id=$1 ${usersStr} RETURNING _id, updated_at as delete_at`;
  const arr = [id];
  return { arr, str };
};

export { getString, newArgs, upArgs, someArgs, allArgs, delArgs, oneArgs };
