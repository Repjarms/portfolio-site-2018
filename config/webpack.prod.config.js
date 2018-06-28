const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.config');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const srcPath = path.resolve(__dirname, '..', 'src');
const distPath = path.resolve(__dirname, '..', 'dist');
const rootPath = path.resolve(__dirname, '..');

module.exports = merge.smart(common, {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [
          { loader: 'file-loader' },
          { loader: 'extract-loader' },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(distPath, {
      root: rootPath,
      verbose: true,
      dry: false,
    }),
  ],
});
