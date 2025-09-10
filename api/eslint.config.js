export default [
  {
    files: ['**/*.js'],
    ignores: ['node_modules/**'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        NodeJS: 'readonly',
        require: 'readonly',
        module: 'readonly',
        __dirname: 'readonly',
      },
    },
    plugins: {},
    rules: {
      // Add custom rules here
    },
  },
];