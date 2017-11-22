const path = require('path');
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
