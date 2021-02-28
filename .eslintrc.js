module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'prettier'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier',
    ],
    parserOptions: {
      project: './tsconfig.json',
      ecmaVersion: 2018,
      sourceType: 'module',
    },
    rules: {
        "prettier/prettier": "error"
    },
}