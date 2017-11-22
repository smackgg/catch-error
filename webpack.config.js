const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  context: path.resolve(__dirname, 'src'),
  entry: './dev.js',
  output: {
    filename: 'index.js',
    sourceMapFilename: 'index.js.map',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    host: '0.0.0.0',
    publicPath: '/',
    stats: 'errors-only',
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
    }],
  },
  devtool: 'source-map',
  plugins: [
    new HtmlWebpackPlugin({
      title: 'catch error',
      inject: true,
      filename: 'index.html',
      template: path.resolve(__dirname, './index.ejs'),
    }),
  ],
};

if (process.env.NODE_ENV === 'production') {
  module.exports.plugins = [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
      },
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
    }),
  ];

  if (process.env.BUILD === 'publish') {
    module.exports.entry = './index.js';
    module.exports.output = {
      path: path.resolve(__dirname, './lib'),
      filename: 'catch-error.min.js',
      umdNamedDefine: true,
      library: 'CatchError',
      libraryTarget: 'umd',
    };
  }
}
