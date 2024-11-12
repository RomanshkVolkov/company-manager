/* eslint-disable import/no-anonymous-default-export */
import next from 'eslint-config-next';
import prettier from 'eslint-config-prettier';
import typescript from '@typescript-eslint/eslint-plugin';
import tsEslintParser from '@typescript-eslint/parser';

export default [
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      next,
      prettier,
      typescript,
    },
    // extends: [
    //   'next/core-web-vitals',
    //   'next',
    //   'prettier',
    //   'plugin:@typescript-eslint/recommended',
    // ],
    languageOptions: {
      parser: tsEslintParser,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'no-duplicate-imports': 'error',
      'no-self-compare': 'error',
      'use-isnan': 'error',
      'arrow-body-style': ['error', 'as-needed'],
      camelcase: 'error',
      'class-methods-use-this': 'error',
      curly: ['error', 'multi-line'],
      eqeqeq: ['error', 'always'],
      'no-var': 'error',
      '@typescript-eslint/no-empty-interface': 'off',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],
      'no-useless-concat': 'error',
      'prefer-const': 'error',
      'prefer-template': 'error',
      'require-await': 'error',
      'array-bracket-spacing': 'error',
      'arrow-parens': 'error',
      'brace-style': 'error',
      'comma-dangle': ['error', 'always-multiline'],
      'jsx-quotes': ['error', 'prefer-double'],
      'keyword-spacing': [
        'error',
        {
          before: true,
        },
      ],
      'key-spacing': [
        'error',
        {
          afterColon: true,
        },
      ],
      'object-curly-spacing': ['error', 'always'],
      quotes: ['error', 'single'],
      semi: 'error',
      'space-before-blocks': 'error',
    },
    ignores: ['!.lintstagedrc.js*'],
  },
];
