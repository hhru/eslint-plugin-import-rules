module.exports = {
    meta: {
        type: 'suggestion', // This can be 'problem', 'suggestion', or 'layout'
        docs: {
            description: 'warn when fetch is called without a signal property',
            category: 'Best Practices',
            recommended: true,
        },
        schema: [], // no options
    },
    create(context) {
        return {
            CallExpression(node) {
                if (
                    node.callee.type === 'MemberExpression' &&
                    ['fetcher', 'axios'].includes(node.callee.object.name) &&
                    node.callee.property.name === 'get'
                ) {
                    const args = node.arguments;

                    if (args.length > 1 && args[1].type === 'ObjectExpression') {
                        const hasSignal = args[1].properties.some(
                            (prop) =>
                                prop.type === 'Property' && prop.key.type === 'Identifier' && prop.key.name === 'signal'
                        );

                        if (!hasSignal) {
                            context.report({
                                node,
                                message: 'Fetcher called without a signal property in the options object.',
                            });
                        }
                    } else if (args.length === 1) {
                        context.report({
                            node,
                            message:
                                'Fetcher called without a second argument. Please add second argument with a signal property',
                        });
                    }
                }
            },
        };
    },
};
