const path = require('path');

module.exports = {
  entry: './index',
  output: {
    filename: 'sg.js',
    path: path.resolve('.'),
    library: 'sg',
    libraryTarget: 'umd'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel'
    }]
  }
};
