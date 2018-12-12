import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import Withdraw from './blocks/Withdraw';

export default createPureComponent(({state_finance_member_withdraw, location}) => {
    return (
        <Withdraw {...state_finance_member_withdraw} location={location}/>
    );
});