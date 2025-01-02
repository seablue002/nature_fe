module.exports = {
  root: true,
  plugins: ['prettier'],
  extends: [
    // add more generic rulesets here, such as:
    // 'eslint:recommended',
    // 'plugin:import/recommended',
    'plugin:vue/vue3-recommended',
    'airbnb-base',
    'plugin:prettier/recommended',
  ],
  rules: {
    // override/add rules settings here, such as:
    // 'vue/no-unused-vars': 'error'
    'vue/multi-word-component-names': [
      'error',
      {
        // 允许index命名组件名称无需多单词组合
        ignores: ['index'],
      },
    ],
    'vue/attribute-hyphenation': ['off'],
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    indent: 'error',
    'no-param-reassign': ['off'],
    'import/prefer-default-export': ['off'],
    'no-use-before-define': ['off'],
    'vue/v-on-event-hyphenation': ['off'],
  },
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false,
  },
  settings: {
    // https://www.npmjs.com/package/eslint-import-resolver-vite
    'import/resolver': {
      // 直接使用vite.config.js中的alias配置，目前有错误，未找到解决方案，先使用eslint-import-resolver-alias 在.eslintrc中也定义一份alias方式
      // vite: {
      //   configPath: './vite.config.js',
      // },
      alias: {
        map: [
          ['@', './src'],
          ['#ASSETS', './src/assets'],
          ['#LAYOUTS', './src/layouts'],
        ],
      },
    },
  },
}
