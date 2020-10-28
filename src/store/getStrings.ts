import { encrypter } from '../utils/utilities';

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
    table === 'users' ? `(${columns}, user_type_id)` : `(${columns})`;
  const strValColumns =
    table === 'users'
      ? `(${valColumn},$${values.length + 1})`
      : `(${valColumn})`;
  const argValues = table === 'users' ? [...values, role] : values;
  return {
    str: `INSERT INTO ${table} ${strColumns} VALUES ${strValColumns} RETURNING _id, nick, email`,
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
      data[key].trim() !== ''
    ) {
      return (auxData[key] = data[key]);
    }
  });
  const valColumn = Object.keys(auxData)
    .map((key) => `${key}='${auxData[key]}'`)
    .join(',');
  const columns = Object.keys(auxData).join(',');

  const activeCond =
    table === 'users' || 'customers' || 'cars' ? 'AND active=true' : '';
  const arr = [id];
  const str = `UPDATE ${table} SET ${valColumn}, updated_at = NOW() WHERE _id=$1 ${activeCond} RETURNING _id,${columns}`;
  return { str, arr };
};

export { newArgs, upArgs };
