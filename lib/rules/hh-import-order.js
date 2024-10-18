"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _importType = _interopRequireDefault(require("eslint-plugin-import/lib/core/importType"));

var _resolve = _interopRequireDefault(require("eslint-module-utils/resolve"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ImportType = {
  /** Зависимости которые обязательно должны быть импортированы в самом начале */
  ShouldBeFirst: 'ShouldBeFirst',

  /** React-related заисимости */
  React: 'React',

  /** Встроенные модули вроде path, util */
  BuiltInModules: 'BuiltInModules',

  /** Внешние зависимости */
  ExternalModules: 'ExternalModules',

  /** HH-библиотеки, задаются регулярным выражением */
  SpecificExternalModules: 'SpecificExternalModules',

  /** Модули текущего проекта */
  ProjectModules: 'ProjectModules',

  /** Модули находящиеся в текущей директории */
  LocalModules: 'LocalModules',

  /** Относительные пути */
  Relative: 'Relative',

  /** Стили */
  Styles: 'Styles',

  /** Относительные импорты стилей */
  RelativeStyles: 'RelativeStyles'
};
/** Токен для обозначения пустой строки */

var BlankLine = 'BlankLine';
var Matchers = [{
  importType: ImportType.ShouldBeFirst,
  match: function match(node, _, options) {
    return options.shouldBeFirstRegexp && new RegExp(options.shouldBeFirstRegexp).exec(node.source.value);
  }
}, {
  importType: ImportType.BuiltInModules,
  match: function match(node, context) {
    return (0, _importType["default"])(node.source.value, context) === 'builtin';
  }
}, {
  importType: ImportType.RelativeStyles,
  match: function match(node, context) {
    return ['sibling', 'parent'].includes((0, _importType["default"])(node.source.value, context)) && node.source.value.endsWith('.less');
  }
}, {
  importType: ImportType.Relative,
  match: function match(node, context) {
    return ['sibling', 'parent'].includes((0, _importType["default"])(node.source.value, context));
  }
}, {
  importType: ImportType.Styles,
  match: function match(node) {
    return node.source.value.endsWith('.less');
  }
}, {
  importType: ImportType.React,
  match: function match(node) {
    return /^react(.)*/.exec(node.source.value);
  }
}, {
  importType: ImportType.SpecificExternalModules,
  match: function match(node, _, options) {
    return options.specificModulesRegexp && new RegExp(options.specificModulesRegexp).exec(node.source.value);
  }
}, {
  importType: ImportType.ExternalModules,
  match: function match(node, context) {
    return (0, _importType["default"])(node.source.value, context) === 'external';
  }
}, {
  importType: ImportType.LocalModules,
  match: function match(node, context) {
    var _resolver;

    return (_resolver = (0, _resolve["default"])(node.source.value, context)) === null || _resolver === void 0 ? void 0 : _resolver.includes("".concat(_path["default"].dirname(context.getFilename()), "/"));
  }
}];
var OrderPattern = [ImportType.ShouldBeFirst, BlankLine, ImportType.BuiltInModules, ImportType.React, ImportType.ExternalModules, BlankLine, ImportType.SpecificExternalModules, BlankLine, ImportType.ProjectModules, BlankLine, ImportType.LocalModules, BlankLine, ImportType.Styles, BlankLine, ImportType.Relative, BlankLine, ImportType.RelativeStyles];

var getImportType = function getImportType(node, context, specificModulesRegexp) {
  var matchedMatcher = Matchers.find(function (matcher) {
    return matcher.match(node, context, specificModulesRegexp);
  });
  return matchedMatcher ? matchedMatcher.importType : ImportType.ProjectModules;
};

var defaultOptions = {
  specificModulesRegexp: '((@hh.ru)|(bloko))(.)*'
};
var _default = {
  meta: {
    type: 'suggestion',
    fixable: 'code',
    schema: [{
      type: 'object',
      properties: {
        specificModulesRegexp: {
          type: 'string'
        },
        shouldBeFirstRegexp: {
          type: 'string'
        }
      },
      additionalProperties: false
    }]
  },
  create: function create(context) {
    var options = _objectSpread(_objectSpread({}, defaultOptions), context.options[0]);

    var sourceCode = context.getSourceCode();
    return {
      Program: function Program(node) {
        var importNodes = node.body.filter(function (subNode) {
          return subNode.type === 'ImportDeclaration';
        });

        if (!importNodes.length) {
          return;
        }

        var mappedImports = {};

        try {
          mappedImports = importNodes.reduce(function (acc, node, index) {
            var comments = sourceCode.getCommentsBefore(node);
            /**
             * Комментарии из начала файла (до первого импорта) оставляем на месте
             * так как с большой вероятностью они относятся ко всему файлу
             */

            var hasComments = index > 0 && (comments === null || comments === void 0 ? void 0 : comments.length) > 0;
            var line = hasComments ? comments[0].loc.start.line : node.loc.start.line;
            var linesCount = node.loc.end.line - line + 1;
            var code = sourceCode.getText(node);

            if (hasComments) {
              code = "".concat(comments.map(function (commentNode) {
                return sourceCode.getText(commentNode);
              }).join('\n'), "\n").concat(code);
            }

            var importType = getImportType(node, context, options);
            var importData = {
              source: node.source.value,
              code: code,
              line: line,
              linesCount: linesCount
            };

            if (!acc[importType]) {
              acc[importType] = [];
            }

            acc[importType].push(importData);
            return acc;
          }, {});
        } catch (e) {
          console.error(context.getFilename(), e);
          return;
        }

        var correctedOrder = [];
        OrderPattern.forEach(function (orderItem) {
          if (orderItem === BlankLine) {
            correctedOrder.length > 0 && correctedOrder[correctedOrder.length - 1] !== BlankLine && correctedOrder.push(BlankLine);
          } else {
            mappedImports[orderItem] && correctedOrder.push.apply(correctedOrder, _toConsumableArray(mappedImports[orderItem].sort(function (a, b) {
              if (a.source < b.source) {
                return -1;
              }

              if (a.source > b.source) {
                return 1;
              }

              return 0;
            })));
          }
        });

        if (correctedOrder[correctedOrder.length - 1] === BlankLine) {
          correctedOrder.pop();
        }

        var nextImportItemLine = importNodes[0].loc.start.line;
        var shouldFix = correctedOrder.some(function (item) {
          var isBlankLine = item === BlankLine;
          var lineIsCorrect = isBlankLine ? true : nextImportItemLine === item.line;
          nextImportItemLine += isBlankLine ? 1 : item.linesCount;
          return !lineIsCorrect;
        });

        if (shouldFix) {
          context.report({
            message: 'Incorrect imports order',
            loc: {
              start: importNodes[0].loc.start,
              end: importNodes[importNodes.length - 1].loc.end
            },
            fix: function fix(fixer) {
              return fixer.replaceTextRange([importNodes[0].range[0], importNodes[importNodes.length - 1].range[1]], correctedOrder.map(function (item) {
                return item === BlankLine ? '' : item.code;
              }).join('\n'));
            }
          });
        }
      }
    };
  }
};
exports["default"] = _default;