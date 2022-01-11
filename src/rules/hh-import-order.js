import getEslintImportType from 'eslint-plugin-import/lib/core/importType';
import resolver from 'eslint-module-utils/resolve';
import path from 'path';

const ImportType = {
    /** React-related заисимости */
    React: 'React',
    /** Встроенные модули вроде path, util */
    BuiltInModules: 'BuiltInModules',
    /** Внешние зависимости */
    ExternalModules: 'ExternalModules',
    /** HH-библиотеки, задаются регулярным выражением */
    HHModules: 'HHModules',
    /** Модули текущего проекта */
    ProjectModules: 'ProjectModules',
    /** Модули находящиеся в текущей директории */
    LocalModules: 'LocalModules',
    /** Относительные пути */
    Relative: 'Relative',
    /** Стили */
    Styles: 'Styles',
};

/** Токен для обозначения пустой строки */
const BlankLine = 'BlankLine';

const Matchers = [
    {
        importType: ImportType.BuiltInModules,
        match: (node, context) => getEslintImportType(node.source.value, context) === 'builtin',
    },
    {
        importType: ImportType.Relative,
        match: (node, context) => ['sibling', 'parent'].includes(getEslintImportType(node.source.value, context)),
    },
    {
        importType: ImportType.Styles,
        match: (node) => node.source.value.endsWith('.less'),
    },
    {
        importType: ImportType.React,
        match: (node) => /^react(.)*/.exec(node.source.value),
    },
    {
        importType: ImportType.HHModules,
        match: (node, _, hhModulesRegexp) => hhModulesRegexp.exec(node.source.value),
    },
    {
        importType: ImportType.ExternalModules,
        match: (node, context) => getEslintImportType(node.source.value, context) === 'external',
    },
    {
        importType: ImportType.LocalModules,
        match: (node, context) =>
            resolver(node.source.value, context)?.includes(`${path.dirname(context.getFilename())}/`),
    },
];

const OrderPattern = [
    ImportType.BuiltInModules,
    ImportType.React,
    ImportType.ExternalModules,
    BlankLine,
    ImportType.HHModules,
    BlankLine,
    ImportType.ProjectModules,
    BlankLine,
    ImportType.LocalModules,
    BlankLine,
    ImportType.Styles,
    BlankLine,
    ImportType.Relative,
];

const getImportType = (node, context, hhModulesRegexp) => {
    const matchedMatcher = Matchers.find((matcher) => matcher.match(node, context, hhModulesRegexp));
    return matchedMatcher ? matchedMatcher.importType : ImportType.ProjectModules;
};

const defaultOptions = {
    hhModulesRegexp: '((@hh.ru)|(bloko))(.)*',
    minImportsToInsertBlankLines: 5,
};

export default {
    meta: {
        type: 'suggestion',
        fixable: 'code',
        schema: [
            {
                type: "object",
                properties: {
                    hhModulesRegexp: {
                        type: "string",
                    },
                    minImportsToInsertBlankLines: {
                        type: "number",
                    },
                },
                additionalProperties: false,
            },
        ],
    },
    create: (context) => {
        const { hhModulesRegexp, minImportsToInsertBlankLines } = { ...defaultOptions, ...context.options[0] };
        const hhModulesRegexpObject = new RegExp(hhModulesRegexp);
        const sourceCode = context.getSourceCode();
        return {
            Program: (node) => {
                const importNodes = node.body.filter((subNode) => subNode.type === 'ImportDeclaration');
                if (!importNodes.length) {
                    return;
                }
                const insertBlankLines = importNodes.length >= minImportsToInsertBlankLines;

                let mappedImports = [];
                try {
                    mappedImports = importNodes.map((node, index) => {
                        const comments = sourceCode.getCommentsBefore(node);
                        /**
                         * Комментарии из начала файла (до первого импорта) оставляем на месте
                         * так как с большой вероятностью они относятся ко всему файлу
                         */
                        const hasComments = index > 0 && comments?.length > 0;
                        const line = hasComments ? comments[0].loc.start.line : node.loc.start.line;
                        const linesCount = node.loc.end.line - line + 1;

                        let code = sourceCode.getText(node);
                        if (hasComments) {
                            code = `${comments
                                .map((commentNode) => sourceCode.getText(commentNode))
                                .join('\n')}\n${code}`;
                        }

                        return {
                            importType: getImportType(node, context, hhModulesRegexpObject),
                            source: node.source.value,
                            code,
                            line,
                            linesCount,
                        };
                    });
                } catch (e) {
                    console.error(context.getFilename(), e);
                    return;
                }

                const correctedOrder = [];

                OrderPattern.forEach((orderItem) => {
                    if (orderItem === BlankLine) {
                        insertBlankLines &&
                            correctedOrder.length > 0 &&
                            correctedOrder[correctedOrder.length - 1] !== BlankLine &&
                            correctedOrder.push(BlankLine);
                    } else {
                        correctedOrder.push(
                            ...mappedImports
                                .filter((mappedImport) => mappedImport.importType === orderItem)
                                .sort((a, b) => {
                                    if (a.source < b.source) {
                                        return -1;
                                    }
                                    if (a.source > b.source) {
                                        return 1;
                                    }
                                    return 0;
                                })
                        );
                    }
                });

                if (correctedOrder[correctedOrder.length - 1] === BlankLine) {
                    correctedOrder.pop();
                }

                let lastLine = importNodes[0].loc.start.line;
                const shouldFix = correctedOrder.some((item) => {
                    const isBlankLine = item === BlankLine;
                    const lineIsCorrect = isBlankLine ? true : lastLine === item.line;
                    lastLine += isBlankLine ? 1 : item.linesCount;
                    return !lineIsCorrect;
                });

                if (shouldFix) {
                    context.report({
                        message: 'Incorrect imports order',
                        loc: {
                            start: importNodes[0].loc.start,
                            end: importNodes[importNodes.length - 1].loc.end,
                        },
                        fix: (fixer) =>
                            fixer.replaceTextRange(
                                [importNodes[0].range[0], importNodes[importNodes.length - 1].range[1]],
                                correctedOrder.map((item) => (item === BlankLine ? '' : item.code)).join('\n')
                            ),
                    });
                }
            },
        };
    },
};
