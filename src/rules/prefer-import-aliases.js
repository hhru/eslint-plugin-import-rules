export default {
    meta: {
        fixable: 'code',
        type: 'suggestion',
        schema: [
            {
                type: 'object',
                properties: {
                    importPaths: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                matchPattern: {
                                    type: 'string',
                                },
                                replaceBy: {
                                    type: 'string',
                                },
                            },
                        },
                    },
                },
            },
        ],
    },

    create(context) {
        const options = context.options[0] || {};
        const pathOptions = (options.importPaths || []).map((path) => ({
            ...path,
            re: new RegExp(path.matchPattern, 'g'),
        }));

        const getMatchedOption = (importPath) => pathOptions.find(({ re }) => importPath.match(re));
        const checkIfMatchAndProposeFix = (importPath) => {
            const matchedOption = getMatchedOption(importPath);
            if (!matchedOption) {
                return false;
            }

            return importPath.replace(matchedOption.re, matchedOption.replaceBy);
        };

        return {
            ImportDeclaration(node) {
                const importPath = node.source.value;
                const fixProposal = checkIfMatchAndProposeFix(importPath);
                if (fixProposal) {
                    context.report({
                        node,
                        message: `Import path "${importPath}" should be "${fixProposal}".`,
                        fix(fixer) {
                            return fixer.replaceText(node.source, `'${fixProposal}'`);
                        },
                    });
                }
            },
        };
    },
};
