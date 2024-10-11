"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _resolve = _interopRequireDefault(require("eslint-module-utils/resolve"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = {
  meta: {
    type: 'suggestion',
    schema: [{
      type: 'object',
      properties: {
        paths: {
          type: 'array',
          items: {
            type: 'string'
          }
        },
        exclusions: {
          type: 'array',
          items: {
            type: 'string'
          }
        }
      }
    }]
  },
  create: function create(context) {
    var options = context.options[0] || {};
    var pathRegexps = (options.paths || []).map(function (pattern) {
      return new RegExp(pattern);
    });
    var exclusionRegexps = (options.exclusions || []).map(function (pattern) {
      return new RegExp(pattern);
    });

    var getMatchedExpression = function getMatchedExpression(importPath) {
      return pathRegexps.find(function (re) {
        return importPath.match(re);
      });
    };

    var getExcludedExpression = function getExcludedExpression(contextPath) {
      return exclusionRegexps.find(function (re) {
        return contextPath.match(re);
      });
    };

    var getMatchFromExpression = function getMatchFromExpression(importPath, regExpression) {
      var match = importPath.match(regExpression);
      return match && match[0] || null;
    };

    function isReachViolation(importPath) {
      var normalizeImportPath = (0, _resolve["default"])(importPath, context);

      if (!normalizeImportPath) {
        return false;
      } // Если ни одно из переданных выражений не совпадает с импортом, правило не нарушается


      var expression = getMatchedExpression(normalizeImportPath);

      if (!expression) {
        return false;
      } // Если импорт не совпадает с выражением из правила, правило не нарушается


      var mathImportPath = getMatchFromExpression(normalizeImportPath, expression);

      if (!mathImportPath) {
        return false;
      }

      var contextFilename = context.getFilename();
      var mathContextName = getMatchFromExpression(contextFilename, expression); // Если файл входит в список исключений, правило не нарушается

      var exclusionPath = getExcludedExpression(contextFilename);

      if (exclusionPath) {
        return false;
      } // Если полученный выражением импорт и полученный выражением файл импорта не совпадают, правило нарушается


      if (mathContextName !== mathImportPath) {
        return true;
      } // во всех остальных случаях правило не нарушается


      return false;
    }

    function checkImportForReaching(importPath, node) {
      if (isReachViolation(importPath)) {
        context.report({
          node: node,
          message: "Reaching to \"".concat(importPath, "\" is not allowed.")
        });
      }
    }

    return {
      ImportDeclaration: function ImportDeclaration(node) {
        checkImportForReaching(node.source.value, node.source);
      }
    };
  }
};
exports["default"] = _default;