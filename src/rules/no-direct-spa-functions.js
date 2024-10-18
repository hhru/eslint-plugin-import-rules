export default {
    meta: {
        type: 'problem',
        docs: {
            description: 'Disallow importing push and replace from connected-react-router',
        },
        schema: [],
        messages: {
            noDirectPushImport: 'Importing "push" directly is not allowed, import usePush from @hh.ru/redux-spa-middleware.',
            noDirectReplaceImport: 'Importing "replace" directly is not allowed, import useReplace from @hh.ru/redux-spa-middleware.',
        },
    },
    create(context) {
        return {
            ImportDeclaration(node) {
                if (node.source.value === 'connected-react-router' || node.source.value === 'connected-react-router/actions') {
                    const importSpecifiers = node.specifiers.filter((specifier) => specifier.type === 'ImportSpecifier');

                    const pushSpecifier = importSpecifiers.find((specifier) => specifier.imported.name === 'push');
                    if (pushSpecifier) {
                        context.report({
                            node: pushSpecifier,
                            messageId: 'noDirectPushImport',
                        });
                    }

                    const replaceSpecifier = importSpecifiers.find((specifier) => specifier.imported.name === 'replace');
                    if (replaceSpecifier) {
                        context.report({
                            node: replaceSpecifier,
                            messageId: 'noDirectReplaceImport',
                        });
                    }
                }
            },
        };
    },
};
