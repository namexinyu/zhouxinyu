import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import CompanyEdit from './blocks/CompanyEdit';

export default createPureComponent(({ state_servicer_labor_company_edit, state_business_common, location, routeParams }) => {
    return (
        <CompanyEdit {...state_servicer_labor_company_edit} businessCommon={{ ...state_business_common }} location={{ ...location }} routeParams={{ ...routeParams }} />
    );
});