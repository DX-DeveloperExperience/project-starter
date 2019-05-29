export const tslintJSON = {
  defaultSeverity: 'error',
  extends: ['tslint:recommended'],
  jsRules: {
    'no-unused-expression': true,
  },
  rules: {
    quotemark: [true, 'single'],
    'member-access': [false],
    'ordered-imports': [false],
    'max-line-length': [true, 150],
    'member-ordering': [false],
    'interface-name': [false],
    'arrow-parens': false,
    'object-literal-sort-keys': false,
    'object-literal-key-quotes': [true, 'as-needed'],
    'no-var-requires': false,
    'import-blacklist': [true, ['.*\\.ts$', '.*\\.js$']],
    'max-classes-per-file': false,
  },
  rulesDirectory: [],
};

export const eslintJSON = {};