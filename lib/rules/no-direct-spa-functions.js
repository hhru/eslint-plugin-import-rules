"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _default = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow importing push and replace from connected-react-router'
    },
    schema: [],
    messages: {
      noDirectPushImport: 'Importing "push" directly is not allowed, import usePush from @hh.ru/redux-spa-middleware.',
      noDirectReplaceImport: 'Importing "replace" directly is not allowed, import useReplace from @hh.ru/redux-spa-middleware.'
    }
  },
  create: function create(context) {
    return {
      ImportDeclaration: function ImportDeclaration(node) {
        if (node.source.value === 'connected-react-router' || node.source.value === 'connected-react-router/actions') {
          var importSpecifiers = node.specifiers.filter(function (specifier) {
            return specifier.type === 'ImportSpecifier';
          });
          var pushSpecifier = importSpecifiers.find(function (specifier) {
            return specifier.imported.name === 'push';
          });

          if (pushSpecifier) {
            context.report({
              node: pushSpecifier,
              messageId: 'noDirectPushImport'
            });
          }

          var replaceSpecifier = importSpecifiers.find(function (specifier) {
            return specifier.imported.name === 'replace';
          });

          if (replaceSpecifier) {
            context.report({
              node: replaceSpecifier,
              messageId: 'noDirectReplaceImport'
            });
          }
        }
      }
    };
  }
};
exports["default"] = _default;