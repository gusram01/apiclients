const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    app: './src/frontend/index.ts',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'src/js/main.js',
    path: path.resolve(__dirname, '..', 'public'),
    publicPath: '/',
  },
  optimization: {
    namedModules: true,
    nodeEnv: 'development',
    noEmitOnErrors: false,
    minimize: false,
    removeAvailableModules: false,
    concatenateModules: true,
    checkWasmTypes: true,
  },
  plugins: [new CleanWebpackPlugin()],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
          },
        ],
        exclude: [/node_modules/, /public/, /back/, /dts/, /config/, /server/],
      },

      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};
