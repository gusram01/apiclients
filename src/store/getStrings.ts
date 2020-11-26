import { Request } from 'express';
import { encrypter } from '../utils/utilities';

interface DataRequest {
  [key: string]: string | number | boolean;
}

// SELECT columns
// FROM table
// WHERE column = value, othercolumn = othervalue
// RETURNING columnstoreturn

// INSERT INTO table (column1,column2 )
// VALUES (value1, value2)
// RETURNING columnstoreturn

/**
 * INSERT INTO (brands) name
 * VALUES $1
 * RETURNING _id
 */

// UPDATE table
// SET column=value, updated_at = NOW()
// WHERE _id=$1 AND active = true
// RETURNING _id, columns

// SELECT columns
// FROM tableA as a
// JOIN tableB as b
// ON a.key = b.key
// WHERE column = value, othercolumn = othervalue
// RETURNING columnstoreturn

function setIntro(req: Request) {
  const table = req.params.table;
  console.log(table);
  const method = req.method;
  if (req.url === '/login') {
    return 'SELECT ';
  }
  if (method === 'POST') {
    return 'INSERT ';
  }
  if (method === 'PUT') {
    return 'UPDATE ';
  }
  return 'SELECT ';
}

const getString = (req: Request) => {
  const intro = setIntro(req);
  console.log(intro);
};

const tablesActive = ['users', 'customers', 'cars'];
const functionType = [
  { id: 'getAll', some: 'WHERE' },
  { id: 'getOne', some: 'AND' },
  { id: 'getSome', some: '' },
  { id: 'newOne', some: '' },
  { id: 'updateOne', some: 'AND' },
  { id: 'delOne', some: 'AND' },
  { id: 'login', some: 'WHERE' },
];

const limitForTable = (table: string) => {
  let finalStr = '';
  if (tablesActive.includes(table)) {
    finalStr = ' active = true';
  }
  return (type: string) => {
    const aux = functionType.find((item) => item.id === type)?.some;
    return `${aux && finalStr !== '' ? aux + finalStr : ''} `;
  };
};

// const mapObject = (data: DataRequest )=>{

// }

const allArgs = (table: string) => {
  const what = limitForTable(table);
  const usersStr = what('getAll');
  const str = `SELECT * FROM ${table} ${usersStr}`;
  return str;
};

const oneIdArgs = (table: string, id: string) => {
  const what = limitForTable(table);
  const usersStr = what('getOne');
  const str = `SELECT * FROM ${table} WHERE _id=$1 ${usersStr}`;
  const arr = [id];
  return { str, arr };
};

const someArgs = (table: string, data: any) => {
  // { table: 'cars_customers', relation: ['cars', 'customers'] },
  // { table: 'users_customers', relation: ['users', 'customers'] },

  const auxData: any = {};
  Object.keys(data).map((key) => {
    if (key.trim() !== 'active' && key.trim() !== 'password') {
      return (auxData[key] = data[key]);
    }
  });
  const auxArr = Object.keys(auxData);
  let arr: any[] = [];
  const valColumn = auxArr
    .map((key, index) => {
      arr.push(auxData[key]);
      return `${key} = $${index + 1}`;
    })
    .join(' AND ');
  const str = `SELECT * FROM ${table} ${
    auxArr.length > 0 ? 'WHERE ' + valColumn : ''
  }`;
  // const auxStr =
  //   'SELECT * FROM cars_categories as a ' +
  //   'JOIN cars as b ' +
  //   'ON b._id = a.cars_id ' +
  //   'JOIN categories as c ' +
  //   'ON c._id = a.categories_id ' +
  //   `${auxArr.length > 0 ? 'WHERE ' + valColumn : ''}`;

  return { str, arr };
};

const newArgs = async (table: string, data: any, role = 1) => {
  const auxData =
    table === 'users'
      ? { ...data, password: await encrypter(data.password) }
      : { ...data };
  const columns = Object.keys(auxData).join(',');
  const values = Object.values(auxData);
  const valColumn = Object.values(auxData)
    .map((_, i) => `$${i + 1}`)
    .join(',');
  const strColumns =
    table === 'users' ? `(${columns}, roles_id)` : `(${columns})`;
  const strValColumns =
    table === 'users'
      ? `(${valColumn},$${values.length + 1})`
      : `(${valColumn})`;
  const argValues = table === 'users' ? [...values, role] : values;
  return {
    str: `INSERT INTO ${table} ${strColumns} VALUES ${strValColumns} RETURNING *`,
    arr: argValues,
  };
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
  const what = limitForTable(table);

  const activeCond = what('updateOne');
  // table === 'users' || table === 'customers' || table === 'cars'
  //   ? 'AND active=true'
  //   : '';
  const arr = [id];
  const str = `UPDATE ${table} SET ${valColumn}, updated_at = NOW() WHERE _id=$1 ${activeCond} RETURNING _id,${columns}`;

  return { str, arr };
};
const delArgs = (table: string, id: string) => {
  const what = limitForTable(table);

  const usersStr = what('delOne');
  // table === 'users' || table === 'customers' || table === 'cars'
  //   ? 'AND active=true'
  //   : '';
  const str = `UPDATE ${table} SET active = false, updated_at = NOW() ${
    table === 'users' ? ',email_e=email,email=""' : ''
  } WHERE _id=$1 ${usersStr} RETURNING _id, updated_at as delete_at`;
  const arr = [id];
  return { arr, str };
};

export { getString, newArgs, upArgs, someArgs, allArgs, delArgs, oneIdArgs };
