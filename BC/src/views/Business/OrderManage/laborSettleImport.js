import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import LaborSettleImport from './LaborOrderManage/LaborSettleImport';

export default createPureComponent(({state_business_labororder_settle_import, routeParams, location}) => {
    return (
        <LaborSettleImport
            {...routeParams}
            {...state_business_labororder_settle_import}
            location={location}/>
    );
});