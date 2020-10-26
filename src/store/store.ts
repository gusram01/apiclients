import { Pool } from 'pg';

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const connectionString = process.env.POSTG1 as string;
let pool: Pool;
let counter = 0;

// Database
export const db = (table: any) => {
  if (!pool) {
    pool = new Pool({ connectionString });
    console.log('from here');
    counter++;
  }
  console.log(counter);

  const from = `FROM ${table}`;
  console.log('DB online');
  return {
    query: async (query: { select: string; where: string }, values: any) =>
      await pool.query(
        `SELECT ${query.select} ${from} WHERE ${query.where}`,
        values
      ),
    getAll: () => {},
    getOne: (id: string) => {},
    newUser: (user: any) => {},
    updateUser: (id: string, user: any) => {},
    delUser: (id: string) => {},
    findId: (id: string) => {},
    login: (id: string) => {},
  };
};
