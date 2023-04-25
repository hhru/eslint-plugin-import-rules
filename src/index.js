import noInternalPageModules from 'rules/no-internal-modules';
import hhImportOrder from 'rules/hh-import-order';
import preferImportAliases from 'rules/prefer-import-aliases';

export const rules = {
    "no-internal-modules": noInternalPageModules,
    "hh-import-order": hhImportOrder,
    "prefer-import-aliases": preferImportAliases,
};

export default {};
