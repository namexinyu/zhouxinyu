import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import BankCardContainer from './blocks/BankCardContainer';

export default createPureComponent(({ state_audit_bankCard_operate, location }) => {
    return (
        <div>
            <BankCardContainer {...state_audit_bankCard_operate} location={{ ...location }} />
        </div>
    );
});
