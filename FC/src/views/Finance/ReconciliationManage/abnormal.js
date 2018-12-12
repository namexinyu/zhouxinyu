import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import SettleAbnormal from './SettleAbnormal';

export default createPureComponent(({state_finance_settleAbnormal, location, state_finance_common}) => {
    return (
        <SettleAbnormal {...state_finance_settleAbnormal}
                           common={state_finance_common}
                           location={location}/>
    );
});