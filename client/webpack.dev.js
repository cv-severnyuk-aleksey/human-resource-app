const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const dotenv = require('dotenv').config( {
  path: path.join(__dirname, '.env.development')
} );

module.exports = merge(common, {
  mode: 'development',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(dotenv.parsed),
    }),
  ],
  devServer: {
    host: 'localhost',
    port: '3000',
    inline: true,
    compress: true,
    writeToDisk: true,
    historyApiFallback: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
      },
    }
  },
});