/* eslint-env node */

const path = require('path');
const fs = require('fs');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const packages = fs.readdirSync('./packages').map(packageName => ({
  basePath: path.resolve(path.join('./packages', packageName)),
  library: packageName.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join('')
}));

const unminifiedUmds = packages.map(({ basePath, library }) => ({
  entry: path.join(basePath, 'src', 'index'),
  output: {
    filename: library + '.js',
    path: path.join(basePath, 'dist'),
    library,
    libraryTarget: 'umd'
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      options: {
        presets: [['es2015', { modules: false }]]
      }
    }]
  }
}));

const minifiedUmds = unminifiedUmds.map(config => Object.assign({}, config, {
  output: Object.assign({}, config.output, {
    filename: config.output.filename.replace(/\.js$/, '.min.js')
  }),
  plugins: [
    new UglifyJSPlugin()
  ]
}));

module.exports = [].concat(unminifiedUmds).concat(minifiedUmds);
