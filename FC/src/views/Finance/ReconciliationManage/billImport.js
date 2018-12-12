import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import BillImport from './ServiceBill/BillImport';

export default createPureComponent(({state_finance_bill_import, state_finance_common, location}) => {
    return (
        <BillImport {...state_finance_bill_import} location={location}/>
    );
});