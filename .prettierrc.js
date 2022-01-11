module.exports = {
    singleQuote: true,
    trailingComma: 'es5',
    printWidth: 120,
    arrowParens: 'always',
    tabWidth: 4,
    overrides: [
        {
            files: ['*.less', '*.css'],
            options: {
                semi: true,
            },
        },
        {
            files: ['*.json'],
            options: {
                semi: true,
                tabWidth: 2,
            },
        },
    ],
};
