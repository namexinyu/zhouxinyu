import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import ServiceBill from './ServiceBill';

export default createPureComponent(({state_finance_serviceBill, location, state_finance_common}) => {
    return (
        <ServiceBill {...state_finance_serviceBill}
                     common={state_finance_common}
                     location={location}/>
    );
});