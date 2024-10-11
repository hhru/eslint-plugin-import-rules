import { RuleTester } from 'eslint';
import rule from 'rules/no-direct-spa-functions';

const ruleTester = new RuleTester({
    parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
});

describe('no-direct-spa-functions', () => {
    ruleTester.run('no-direct-spa-functions', rule, {
        valid: [
            {
                code: `import { push } from '@hh.ru/redux-spa-middleware';`,
            },
            {
                code: `import { replace } from '@hh.ru/redux-spa-middleware';`,
            },
            {
                code: `import { push, replace } from '@hh.ru/redux-spa-middleware';`,
            },
            {
                code: `import { somethingElse } from 'connected-react-router';`,
            },
        ],
        invalid: [
            {
                code: `import { push } from 'connected-react-router';`,
                errors: [
                    {
                        messageId: 'noDirectPushImport',
                    },
                ],
            },
            {
                code: `import { replace } from 'connected-react-router';`,
                errors: [
                    {
                        messageId: 'noDirectReplaceImport',
                    },
                ],
            },
            {
                code: `import { push, replace } from 'connected-react-router';`,
                errors: [
                    {
                        messageId: 'noDirectPushImport',
                    },
                    {
                        messageId: 'noDirectReplaceImport',
                    },
                ],
            },
            {
                code: `import { push } from 'connected-react-router/actions';`,
                errors: [
                    {
                        messageId: 'noDirectPushImport',
                    },
                ],
            },
            {
                code: `import { replace } from 'connected-react-router/actions';`,
                errors: [
                    {
                        messageId: 'noDirectReplaceImport',
                    },
                ],
            },
        ],
    });
});
