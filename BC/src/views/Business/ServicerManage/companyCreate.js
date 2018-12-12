import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import CompanyCreate from './blocks/CompanyCreate';

export default createPureComponent(({ state_servicer_labor_company_create, state_business_common, location, routeParams }) => {
    return (
        <CompanyCreate {...state_servicer_labor_company_create} businessCommon={{ ...state_business_common }} location={{ ...location }} routeParams={{ ...routeParams }} />
    );
});