"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.rules = void 0;

var _noInternalModules = _interopRequireDefault(require("./rules/no-internal-modules"));

var _hhImportOrder = _interopRequireDefault(require("./rules/hh-import-order"));

var _preferImportAliases = _interopRequireDefault(require("./rules/prefer-import-aliases"));

var _noDirectSpaFunctions = _interopRequireDefault(require("./rules/no-direct-spa-functions"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var rules = {
  "no-internal-modules": _noInternalModules["default"],
  "hh-import-order": _hhImportOrder["default"],
  "prefer-import-aliases": _preferImportAliases["default"],
  "no-direct-spa-functions": _noDirectSpaFunctions["default"]
};
exports.rules = rules;
var _default = {};
exports["default"] = _default;