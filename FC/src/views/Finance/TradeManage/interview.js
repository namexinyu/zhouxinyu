import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import Interview from './Interview/Interview';

export default createPureComponent(({state_finance_trade_interview, state_finance_trade_complain_labor, state_finance_common, location}) => {
    return (
        <Interview {...state_finance_trade_interview}
                   common={state_finance_common}
                   location={location}/>
    );
});