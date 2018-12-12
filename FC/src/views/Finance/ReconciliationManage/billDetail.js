import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import ServiceBillDetail from './ServiceBillDetail';

export default createPureComponent(({state_finance_serviceBillDetail, location, state_finance_common}) => {
    return (
        <ServiceBillDetail {...state_finance_serviceBillDetail}
                           common={state_finance_common}
                           location={location}/>
    );
});