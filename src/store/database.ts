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
const qf = new QueryFile('file.sql', {
  minify: true,
});
if (qf.error) {
  throw new ErrorResponse(500, qf.error.message);
}

db.none(qf)
  .then(() => console.log('DB ready'))
  .catch(console.log);

export default db;
