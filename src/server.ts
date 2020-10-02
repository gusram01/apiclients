import app from './app';

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const port = process.env.PORT! || 3000;

app.listen(port, () => console.log(`Server listening on port: ${port}`));
