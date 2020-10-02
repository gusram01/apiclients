const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');

function recursiveIssuer(m) {
  if (m.issuer) {
    return recursiveIssuer(m.issuer);
  } else if (m.name) {
    return m.name;
  } else {
    return false;
  }
}

module.exports = {
  mode: 'production',
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
    namedModules: false,
    nodeEnv: 'production',
    concatenateModules: true,
    noEmitOnErrors: true,
    checkWasmTypes: true,
    minimize: true,
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
    splitChunks: {
      cacheGroups: {
        appStyles: {
          name: 'app',
          test: (m, c, entry = 'home') =>
            m.constructor.name === 'CssModule' && recursiveIssuer(m) === entry,
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({ filename: 'src/css/main.css' }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
          },
        ],
        exclude: [/node_modules/, /public/, /dist/],
      },

      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },

      // {
      //   test: /\.(png|svg|jpg|gif)$/,
      //   use: [
      //     {
      //       loader: 'file-loader',
      //       options: {
      //         outputPath: '/assets/img',
      //         publicPath: '/assets/img',
      //         emitFile: true
      //       }
      //     },
      //     {
      //       loader: 'image-webpack-loader',
      //       options: {
      //         // bypassOnDebug: true, // webpack@1.x
      //         // disable: true, // webpack@2.x and newer
      //         mozjpeg: {
      //           progressive: true,
      //           quality: 65
      //         },
      //         // optipng.enabled: false will disable optipng
      //         optipng: {
      //           enabled: false,
      //         },
      //         pngquant: {
      //           quality: [ 0.65, 0.90 ],
      //           speed: 4
      //         },
      //         gifsicle: {
      //           interlaced: false,
      //         },
      //         // the webp option will enable WEBP
      //         webp: {
      //           quality: 75
      //         }
      //       },
      //     },
      //   ]
      // },
    ],
  },
};
