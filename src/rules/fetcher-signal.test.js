const { RuleTester } = require('eslint');
const rule = require('./fetcher-signal');

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2020 } });

ruleTester.run('fetch-signal', rule, {
    valid: [
        // Valid cases
        'fetcher.get(url, { signal: controller.signal })',
        "fetcher.get(url, { method: 'GET', signal: controller.signal })",
        'fetcher.get(url, options)', // Second argument is a variable, can't determine if signal is present
    ],
    invalid: [
        // Invalid cases
        {
            code: 'fetcher.get(url)',
            errors: [
                {
                    message:
                        'Fetcher called without a second argument. Please add second argument with a signal property',
                },
            ],
        },
        {
            code: 'fetcher.get(url, {})',
            errors: [{ message: 'Fetcher called without a signal property in the options object.' }],
        },
        {
            code: "fetcher.get(url, { method: 'GET' })",
            errors: [{ message: 'Fetcher called without a signal property in the options object.' }],
        },
        {
            code: "fetcher.get(url, { headers: { 'Content-Type': 'application/json' } })",
            errors: [{ message: 'Fetcher called without a signal property in the options object.' }],
        },
    ],
});
