/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: ['prettier'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  overrides: [
    {
      extends: ['plugin:@typescript-eslint/recommended'],
      files: ['*.ts', '*.tsx'],
    },
  ],
};
