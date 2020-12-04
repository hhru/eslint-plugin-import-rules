import sinon from 'sinon';
import mock from 'mock-require';
import chai, {expect} from 'chai';

chai.use(require('sinon-chai'));
chai.use(require('dirty-chai'));

mock('eslint-module-utils/resolve', (importPath) => importPath);

describe('Rule: no-internal-modules', () => {
    it('Rule is not broken', () => {
        const noInternalPageModules = require('rules/no-internal-modules').default;
        const context = {
            options: [
                {
                    paths: ['(?:lux/pages/[^/]*)'],
                },
            ],
            getFilename: () => 'lux/pages/TestNamePage/index.js',
            report: sinon.spy(),
        };

        noInternalPageModules
            .create(context)
            .ImportDeclaration({
            source: {
                value: 'lux/pages/TestNamePage/testModuleImport.js',
            },
        });

        expect(context.report).to.not.have.been.calledOnce();
    });

    it('Rule is broken (Another page)', () => {
        const noInternalPageModules = require('rules/no-internal-modules').default;
        const context = {
            options: [
                {
                    paths: ['(?:lux/pages/[^/]*)'],
                },
            ],
            getFilename: () => 'lux/pages/AnotherModule/index.js',
            report: sinon.spy(),
        };

        noInternalPageModules
            .create(context)
            .ImportDeclaration({
                source: {
                    value: 'lux/pages/TestNamePage/testModuleImport.js',
                },
            });

        expect(context.report).to.have.been.calledOnce();
    });

    it('Rule is broken (Another directory)', () => {
        const noInternalPageModules = require('rules/no-internal-modules').default;
        const context = {
            options: [
                {
                    paths: ['(?:lux/pages/[^/]*)'],
                },
            ],
            getFilename: () => 'lux/anotherDirectory/AnotherModule/index.js',
            report: sinon.spy(),
        };

        noInternalPageModules
            .create(context)
            .ImportDeclaration({
                source: {
                    value: 'lux/pages/TestNamePage/testModuleImport.js',
                },
            });

        expect(context.report).to.have.been.calledOnce();
    });

    it('Rule is not broken (excluded file)', () => {
        const noInternalPageModules = require('rules/no-internal-modules').default;
        const context = {
            options: [
                {
                    paths: ['(?:lux/pages/[^/]*)'],
                    exclusions: ['(?:lux/modules/routes.js)'],
                },
            ],
            getFilename: () => 'lux/modules/routes.js',
            report: sinon.spy(),
        };

        noInternalPageModules
            .create(context)
            .ImportDeclaration({
                source: {
                    value: 'lux/pages/TestNamePage/testModuleImport.js',
                },
            });

        expect(context.report).to.not.have.been.calledOnce();
    });
});
