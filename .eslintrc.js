module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  rules: {
    'no-unused-vars': 'warn', // 사용되지 않는 변수를 경고
    'no-console': 'off', // console.log() 허용
    '@typescript-eslint/no-explicit-any': 'off', // any 타입 허용
  },
};
