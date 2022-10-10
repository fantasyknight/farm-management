module.exports = {
  root: true,
  extends: [
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:@typescript-eslint/recommended',
    'plugin:jest/recommended',
    'prettier',
    'prettier/react',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended'
  ],
  plugins: ["react", "jsx-a11y", "import", "prettier", "@typescript-eslint"],
  env: {
    browser: true,
    es6: true,
    jest: true,
  },
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.eslint.json',
  },
  rules: {
    'linebreak-style': 'off',
    "react/prop-types": ["off", {}],
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
    "import/prefer-default-export": 1,
    "jsx-a11y/label-has-associated-control": 1,
    "react-hooks/exhaustive-deps": 1,
    "react/button-has-type": 1,
    "@typescript-eslint/ban-ts-ignore": "off",
    "@typescript-eslint/naming-convention": "off",
    '@typescript-eslint/no-var-requires': 0,
    'jsx-a11y/no-static-element-interactions': [
      1,
      {
        handlers: [
          'onClick',
          'onMouseDown',
          'onMouseUp',
          'onKeyPress',
          'onKeyDown',
          'onKeyUp',
        ],
      },
    ],
    // "import/prefer-default-export": 1,
  },
};
