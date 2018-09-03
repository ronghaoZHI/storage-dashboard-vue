module.exports = {
  root: true,
  parserOptions: {
    parser: "babel-eslint",
    sourceType: "module"
  },
  env: {
    browser: true,
    "es6": true,
    "node": true
  },
  extends: ["eslint-config-alloy/vue", "prettier"],
  rules: {
    indent: 0,
    radix: 0,
    "no-return-assign": 0,
    "no-empty-function": 0,
    "no-param-reassign": 0,
    "no-extra-boolean-cast": 0,
    "no-new": 0,
    "array-callback-return": 0,
    complexity: 0,
    "no-empty": 0,
    "no-undefined": 0,
    semi: ["error", "never"],
    "no-unexpected-multiline": 0,
    "no-control-regex": 0,
    "no-multiple-empty-lines": 0,
    "no-sequences": 0,
    "no-control-regex": 0,
    "no-mixed-spaces-and-tabs": ["error", "smart-tabs"],
    "vue/valid-v-model": 0,
    "arrow-parens": 0,
    "comma-dangle": ["error", "always-multiline"],
    // allow async-await
    "generator-star-spacing": 0,
    "prefer-promise-reject-errors": 0,
    // allow debugger during development
    "no-debugger": process.env.NODE_ENV === "production" ? 2 : 0,
    "no-multiple-empty-lines": ["error", { max: 2, maxEOF: 1 }]
  },
  globals: {
    _: false,
    $t: false,
    $: false
  }
};
