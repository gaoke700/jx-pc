// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
  },
  env: {
    browser: true,
    es6: true,
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: 'airbnb-base',
  // required to lint *.vue files
  plugins: [
    'html',
  ],
  globals: {
    md5: true,
    WxLogin: true,
  },
  // add your custom rules here
  'rules': {
    'no-plusplus': 0,
    'no-param-reassign': 0,
    'max-len': [0, 200],
    'no-new': 0,
    'linebreak-style': 0,
    'func-names': 2,
    'indent': [2, 2, { 'SwitchCase': 1 }],
    'no-console': 0,
    'global-require': 0,
    'import/extensions': 0,
    'import/no-extraneous-dependencies': 0,
    'import/no-unresolved': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
};
