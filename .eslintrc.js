module.exports = {
    root: true,
    parser: 'babel-eslint',
    parserOptions: {
        sourceType: 'module'
    },
    env: {
        browser: true,
    },
    // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
    extends: 'standard',
    // required to lint *.vue files
    plugins: [
        'html'
    ],
    // add your custom rules here
    'rules': {
        'indent': ['error', 4],
        'no-return-assign': 0,
        'no-extra-boolean-cast': 0,
        'no-new': 0,
        'semi': ['error', 'never'],
        'no-mixed-spaces-and-tabs': ['error', 'smart-tabs'],
        // allow paren-less arrow functions
        'arrow-parens': 0,
        // allow async-await
        'generator-star-spacing': 0,
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
    },
    'globals': {
        '_': false,
        '$t': false,
        '$': false
    }
}