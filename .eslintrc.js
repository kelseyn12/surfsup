module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-native/all',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  plugins: ['react', 'react-hooks', '@typescript-eslint', 'react-native'],
  rules: {
    // Customize rules here
    'react/prop-types': 'off', // Since we use TypeScript for type checking
    'react/react-in-jsx-scope': 'off', // Not needed with new JSX transform
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn', // Warn about any type
    'react-native/no-unused-styles': 'warn',
    'react-native/no-inline-styles': 'warn',
    'react-native/no-color-literals': 'warn',
    'react-native/no-raw-text': 'off', // Allow raw text (often needed for small components)
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  env: {
    node: true,
    jest: true,
    'react-native/react-native': true,
  },
  ignorePatterns: ['node_modules/', 'coverage/', '.expo/', 'android/', 'ios/', 'web-build/'],
}; 