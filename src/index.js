import noInternalPageModules from 'rules/no-internal-modules';
import hhImportOrder from 'rules/hh-import-order';
import preferImportAliases from 'rules/prefer-import-aliases';
import noDirectSpaFunctions from 'rules/no-direct-spa-functions';

export const rules = {
    "no-internal-modules": noInternalPageModules,
    "hh-import-order": hhImportOrder,
    "prefer-import-aliases": preferImportAliases,
    "no-direct-spa-functions": noDirectSpaFunctions,
};

export default {};
