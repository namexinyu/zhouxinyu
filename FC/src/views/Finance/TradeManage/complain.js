import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import Complain from './ComplainOrder/Complain';

export default createPureComponent(({state_finance_trade_complain, state_finance_trade_complain_labor, state_finance_common, location}) => {
    return (
        <Complain state_finance_trade_complain={state_finance_trade_complain}
                       state_finance_trade_complain_labor={state_finance_trade_complain_labor}
                       common={state_finance_common}
                       location={location}/>
    );
});