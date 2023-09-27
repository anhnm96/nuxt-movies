module.exports = {
  root: true,
  extends: ['@antfu', '@vue/eslint-config-prettier'],
  rules: {
    'no-console': 'warn',
    'antfu/if-newline': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
  },
  ignorePatterns: ['package.json', 'pnpm-lock.yaml'],
}
