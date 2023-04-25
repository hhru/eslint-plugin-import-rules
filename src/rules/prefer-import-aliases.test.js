import sinon from 'sinon';
import mock from 'mock-require';
import chai, {expect} from 'chai';

chai.use(require('sinon-chai'));
chai.use(require('dirty-chai'));

mock('eslint-module-utils/resolve', (importPath) => importPath);

describe('Rule: prefer-import-alias', () => {
    it('Rule is violated', () => {
        const noInternalPageModules = require('rules/prefer-import-aliases').default;
        const context = {
            options: [
                {
                    importPaths: [{
                        matchPattern: '^@hh\\.ru/bloko/build',
                        replaceBy: 'bloko',
                    }],
                },
            ],
            report: sinon.spy(),
        };

        noInternalPageModules
            .create(context)
            .ImportDeclaration({
            source: {
                value: '@hh.ru/bloko/build/button',
            },
        });

        expect(context.report).to.have.been.calledOnce();
        let callArgs = context.report.getCall(0).args[0];
        expect(callArgs).to.have.property('fix');
        expect(callArgs.fix).to.be.a('function');
        const fixer = {
            replaceText: sinon.spy(),
        };
        callArgs.fix(fixer);
        expect(fixer.replaceText).to.have.been.calledOnce();
        callArgs = fixer.replaceText.getCall(0).args;
        expect(callArgs[0]).to.have.property('value', '@hh.ru/bloko/build/button');
        expect(callArgs[1]).equal('\'bloko/button\'');
    });

    it('Rule is not violated', () => {
        const noInternalPageModules = require('rules/prefer-import-aliases').default;
        const context = {
            options: [
                {
                    importPaths: [{
                        matchPattern: '^@hh\\.ru/bloko/build',
                        replaceBy: 'bloko',
                    }],
                },
            ],
            report: sinon.spy(),
        };

        noInternalPageModules
            .create(context)
            .ImportDeclaration({
            source: {
                value: '@hh.ru/bloko/button',
            },
        });

        expect(context.report).to.not.have.been.called();
    });
});
