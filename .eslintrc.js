'use strict';

module.exports = {
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  plugins: ['flowtype'],
  extends: ['msrose', 'msrose/jest'],
  rules: {
    'flowtype/boolean-style': 'error',
    'flowtype/define-flow-type': 'error',
    'flowtype/delimiter-dangle': 'error',
    'flowtype/generic-spacing': 'error',
    'flowtype/no-dupe-keys': 'error',
    'flowtype/no-primitive-constructor-types': 'error',
    'flowtype/require-parameter-type': ['error', { excludeArrowFunctions: 'expressionsOnly' }],
    'flowtype/require-return-type': ['error', 'always', { excludeArrowFunctions: 'expressionsOnly' }],
    'flowtype/require-valid-file-annotation': ['error', 'always'],
    'flowtype/semi': 'error',
    'flowtype/space-after-type-colon': 'error',
    'flowtype/space-before-generic-bracket': 'error',
    'flowtype/space-before-type-colon': 'error',
    'flowtype/union-intersection-spacing': 'error',
    'flowtype/use-flow-type': 'error',
    'flowtype/no-types-missing-file-annotation': 'error'
  }
};
