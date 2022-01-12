import { RuleTester } from 'eslint';

import myRule from 'rules/hh-import-order';

/**
 * Для упрощения написания блоков кода
 *
 * Удаляет первую строку которая остаётся пустой для удобства форматирования и читания кода
 */
const codeHelper = (code) => code.split('\n').slice(1).join('\n');

const ruleTester = new RuleTester({
    parser: require.resolve('@babel/eslint-parser'),
    parserOptions: { ecmaVersion: 7, sourceType: 'module' },
    settings: {
        'import/resolver': {
            'eslint-import-resolver-custom-alias': {
                alias: {
                    app: './src/rules/__mocks__',
                },
            },
        },
        'import/internal-regex': /^app/,
    },
});

ruleTester.run('hh-import-order', myRule, {
    valid: [
        {
            // Задание кастомной регулярки для определения hh-модулей работает
            code: codeHelper(`
import Something from 'util';
import React from 'react';

import SomeBlokoModule from 'bloko-loko/module2';
import SomeBlokoModule2 from 'bloko-loko/module3';
import SomeBlokoModule3 from 'bloko/module';

import SomeModule from './module';

import styles from './styles.less';`),
            options: [{ specificModulesRegexp: '((bloko)|(bloko-loko))(.)*' }],
        },
        {
            // Корректный порядок с пустыми строками
            code: codeHelper(`
import Something from 'util';
import React from 'react';

import SomeHHModule from '@hh.ru/some-module';
import SomeBlokoModule from 'bloko/module';
import SomeBlokoModule2 from 'bloko/module2';
import SomeBlokoModule3 from 'bloko/module3';

import SomeAppModule from 'app/module';

import styles from './styles.less';
import styles2 from './styles2.less';`),
        },
        {
            // Комментарии рядом с импортами и в начале файла не мешают правилу
            code: codeHelper(`
/* eslint-disable-some-thing */
import Something from 'util';
import React from 'react';

import SomeBlokoModule from 'bloko/module';
// My favorite bloko module
import SomeBlokoModule2 from 'bloko/module2';

// Some random comment
import SomeAppModule from 'app/module';`),
        },
        {
            // Можно задать регулярку для модулей которые должны быть импортированы в самом начале
            code: codeHelper(`
import mockComponent from 'app/testUtils/mockComponent';
import React from 'react';

import SomeBlokoModule from 'bloko/module';

import SomeAppModule from 'app/module';`),
            options: [{ shouldBeFirstRegexp: '^app/testUtils/(.)*' }],
        },
    ],
    invalid: [
        {
            // Неверный порядок
            code: codeHelper(`
import Something from 'util';
import SomeModule from './module';
import React from 'react';
import styles from './styles.less';`),
            errors: [{ message: 'Incorrect imports order' }],
            output: codeHelper(`
import Something from 'util';
import React from 'react';

import SomeModule from './module';

import styles from './styles.less';`),
        },
        {
            // Отсутствуют пропуски строк
            code: codeHelper(`
import Something from 'util';
import React from 'react';
import SomeBlokoModule from 'bloko/module';
import SomeBlokoModule2 from 'bloko/module2';
import SomeBlokoModule3 from 'bloko/module3';
import SomeAppModule from 'app/module';
import styles from './styles.less';
import styles2 from './styles2.less';`),
            errors: [{ message: 'Incorrect imports order' }],
            output: codeHelper(`
import Something from 'util';
import React from 'react';

import SomeBlokoModule from 'bloko/module';
import SomeBlokoModule2 from 'bloko/module2';
import SomeBlokoModule3 from 'bloko/module3';

import SomeAppModule from 'app/module';

import styles from './styles.less';
import styles2 from './styles2.less';`),
        },
    ],
});
