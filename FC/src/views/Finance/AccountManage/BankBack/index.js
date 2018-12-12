import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import BankBack from './blocks/BankBack';

export default createPureComponent(({state_finance_bank_back, location}) => {
    return (
        <BankBack {...state_finance_bank_back} location={location}/>
    );
});