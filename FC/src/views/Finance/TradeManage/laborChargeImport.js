import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import LaborChargeImport from './Fee/LaborChargeImport';

export default createPureComponent(({state_finance_labor_charge_import, state_finance_common, location}) => {
    return (
        <LaborChargeImport
            {...state_finance_labor_charge_import}
            common={state_finance_common}
            location={location}/>
    );
});