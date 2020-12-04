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
                    exclusions: {
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
        const exclusionRegexps = (options.exclusions || []).map((pattern) => new RegExp(pattern));

        const getMatchedExpression = (importPath) => pathRegexps.find((re) => importPath.match(re));
        const getExcludedExpression = (contextPath) => exclusionRegexps.find((re) => contextPath.match(re));
        const getMatchFromExpression = (importPath, regExpression) => {
            const match = importPath.match(regExpression);

            return match && match[0] || null;
        };

        function isReachViolation(importPath) {
            const normalizeImportPath = resolve(importPath, context);
            if (!normalizeImportPath) { return false; }

            // Если ни одно из переданных выражений не совпадает с импортом, правило не нарушается
            const expression = getMatchedExpression(normalizeImportPath);
            if (!expression) { return false; }

            // Если импорт не совпадает с выражением из правила, правило не нарушается
            const mathImportPath = getMatchFromExpression(normalizeImportPath, expression);
            if (!mathImportPath) { return false; }

            const contextFilename = context.getFilename();
            const mathContextName = getMatchFromExpression(contextFilename, expression);

            // Если файл входит в список исключений, правило не нарушается
            const exclusionPath = getExcludedExpression(contextFilename);
            if (exclusionPath) {
                return false;
            }

            // Если полученный выражением импорт и полученный выражением файл импорта не совпадают, правило нарушается
            if (mathContextName !== mathImportPath) { return true; }

            // во всех остальных случаях правило не нарушается
            return false;
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
