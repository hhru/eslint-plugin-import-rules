import resolve from "eslint-module-utils/resolve";

export default {
    meta: {
        type: 'suggestion',
        schema: [
            {
                type: 'object',
                properties: {
                    paths: {
                        type: 'array',
                        items: {
                            type: 'string',
                        },
                    },
                },
            },
        ],
    },

    create(context) {
        const options = context.options[0] || {};
        const pathRegexps = (options.paths || []).map((pattern) => new RegExp(pattern));

        const getMatchedExpression = (importPath) => pathRegexps.find((re) => importPath.match(re));
        const getMatchFromExpression = (importPath, regExpression) => {
            const match = importPath.match(regExpression);

            return (match && match[0]) ? match[0] : null;
        };

        function isReachViolation(importPath) {
            const normalizeImportPath = resolve(importPath, context);
            if (!normalizeImportPath) { return false; }

            // Если ни одно из переданных выражений не совпадает с импортом, правило не нарушается
            const expression = getMatchedExpression(normalizeImportPath);
            if (!expression) { return false; }

            // если полученное выражение не совпадает с файлом контекста, правило не нарушается
            const contextFilename = context.getFilename();
            const mathFileName = getMatchFromExpression(contextFilename, expression);
            if (!mathFileName) { return false; }

            // Если полученный выражением импорт и полученный выражением файл импорта совпадают, правило не нарушается
            const mathPath = getMatchFromExpression(normalizeImportPath, expression);
            if (mathPath === mathFileName) { return false; }

            // во всех остальных случаях правило нарушается
            return true;
        }

        function checkImportForReaching(importPath, node) {
            if (isReachViolation(importPath)) {
                context.report({
                    node,
                    message: `Reaching to "${importPath}" is not allowed.`,
                });
            }
        }

        return {
            ImportDeclaration(node) {
                checkImportForReaching(node.source.value, node.source);
            },
        };
    },
};
