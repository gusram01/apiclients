import PGP, { QueryFile } from 'pg-promise';
import { ErrorResponse } from '../utils/ErrorResponse';

const connectionString = process.env.POSTG1 as string;
const pgp = PGP({
  connect(client, dc, useCount) {
    const cp = client.connectionParameters;
    console.log('DB Online', cp.database, useCount);
  },
});
const db = pgp(connectionString);

export default db;
