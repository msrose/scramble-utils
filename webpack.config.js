/* eslint-env node */

const path = require('path');
const fs = require('fs');

module.exports = fs.readdirSync('./packages').map(packageName => {
  const basePath = path.resolve(path.join('./packages', packageName));
  return {
    entry: path.join(basePath, 'index'),
    output: {
      filename: 'build.js',
      path: basePath,
      library: packageName.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(''),
      libraryTarget: 'umd'
    },
    module: {
      rules: [{
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }]
    }
  };
});
