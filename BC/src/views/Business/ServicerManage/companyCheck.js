import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import CompanyCheck from './blocks/CompanyCheck';

export default createPureComponent(({ state_servicer_labor_company_check, state_business_common, location, common }) => {
    return (
        <CompanyCheck {...state_servicer_labor_company_check} businessCommon={{ ...state_business_common }} location={{ ...location }} />
    );
});