"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _default = {
  meta: {
    fixable: 'code',
    type: 'suggestion',
    schema: [{
      type: 'object',
      properties: {
        importPaths: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              matchPattern: {
                type: 'string'
              },
              replaceBy: {
                type: 'string'
              }
            }
          }
        }
      }
    }]
  },
  create: function create(context) {
    var options = context.options[0] || {};
    var pathOptions = (options.importPaths || []).map(function (path) {
      return _objectSpread(_objectSpread({}, path), {}, {
        re: new RegExp(path.matchPattern, 'g')
      });
    });

    var getMatchedOption = function getMatchedOption(importPath) {
      return pathOptions.find(function (_ref) {
        var re = _ref.re;
        return importPath.match(re);
      });
    };

    var checkIfMatchAndProposeFix = function checkIfMatchAndProposeFix(importPath) {
      var matchedOption = getMatchedOption(importPath);

      if (!matchedOption) {
        return false;
      }

      return importPath.replace(matchedOption.re, matchedOption.replaceBy);
    };

    return {
      ImportDeclaration: function ImportDeclaration(node) {
        var importPath = node.source.value;
        var fixProposal = checkIfMatchAndProposeFix(importPath);

        if (fixProposal) {
          context.report({
            node: node,
            message: "Import path \"".concat(importPath, "\" should be \"").concat(fixProposal, "\"."),
            fix: function fix(fixer) {
              return fixer.replaceText(node.source, "'".concat(fixProposal, "'"));
            }
          });
        }
      }
    };
  }
};
exports["default"] = _default;