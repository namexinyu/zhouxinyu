import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import Company from './blocks/Company';

export default createPureComponent(({ state_servicer_labor_company_list, state_business_common, location }) => {
    return (
        <Company {...state_servicer_labor_company_list} businessCommon={{ ...state_business_common }} location={{ ...location }} />
    );
});