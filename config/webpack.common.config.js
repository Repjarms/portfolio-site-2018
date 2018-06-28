const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const srcPath = path.resolve(__dirname, '..', 'src');
const distPath = path.resolve(__dirname, '..', 'dist');
const devMode = process.env.NODE_ENV !== 'production';

module.exports = {
  entry: `${srcPath}/index.js`,
  output: {
    path: distPath,
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.pug$/,
        use: [
          { loader: 'file-loader', options: {
            name: '[name].html',
          } },
          { loader: 'extract-loader' },
          { loader: 'html-loader' },
          { loader: 'pug-html-loader' },
        ],
      },
      {
        test: /\.css$/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin(),
  ],
};