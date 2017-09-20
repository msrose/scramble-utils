# Rubik's Cube Scramble Utilities

[![Build Status](https://travis-ci.org/msrose/scramble-utils.svg?branch=master)](https://travis-ci.org/msrose/scramble-utils) [![Coverage Status](https://coveralls.io/repos/github/msrose/scramble-utils/badge.svg?branch=master)](https://coveralls.io/github/msrose/scramble-utils?branch=master) [![devDependencies Status](https://david-dm.org/msrose/scramble-utils/dev-status.svg)](https://david-dm.org/msrose/scramble-utils?type=dev) [![Greenkeeper badge](https://badges.greenkeeper.io/msrose/scramble-utils.svg)](https://greenkeeper.io/)

A collection of npm packages for dealing with Rubik's cube scrambles. See the individual package README for documentation.

| Package | NPM Version | Description |
| --- | --- | --- |
| [scramble-generator](./packages/scramble-generator) | [![npm](https://img.shields.io/npm/v/scramble-generator.svg)](https://www.npmjs.com/package/scramble-generator) | Generate and format scrambles for any cubic puzzle |
| [scramble-parser](./packages/scramble-parser) | [![npm](https://img.shields.io/npm/v/scramble-parser.svg)](https://www.npmjs.com/package/scramble-parser) | Parse a given scramble string into a list of cube moves |
| [scramble-utils-common](./packages/scramble-utils-common) | [![npm](https://img.shields.io/npm/v/scramble-utils-common.svg)](https://www.npmjs.com/package/scramble-utils-common) | Common functions and constants for scramble-utils packages |

By default, each package is require-able: 
- in Node.js on the back-end
- with webpack/browserify/etc. on the front-end

```javascript
import generateScramble from 'scramble-generator';

// or ...

const generateScramble = require('scramble-generator').default;
```

A UMD (both minified and unminified) is also distributed with each package, located in `node_modules/package-name/dist/PackageName.[min].js`, for use in AMD environments or directly in the browser. The global name exported is the PascalCase version of the package name. For example `scramble-generator` is available as `window.ScrambleGenerator`.
