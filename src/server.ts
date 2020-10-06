import app from './app';

// Implementing Webpack for development build frontend js/css
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
  const webpack = require('webpack');
  const compiler = webpack(require('../config/webpack.config.dev.js'));

  compiler.watch(
    {
      // Example watchOptions
      aggregateTimeout: 300,
      poll: undefined,
    },
    (err: any, stats: any) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log(stats.toJson('minimal'));
    }
  );
}
// Implementing Webpack for development build frontend js/css

const port = process.env.PORT! || 3000;

app.listen(port, () => console.log(`Server listening on port: ${port}`));
