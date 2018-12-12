import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import BalanceDetails from './blocks/BalanceDetails';

export default createPureComponent(({state_finance_common, state_fc_balanceDetails}) => {
    return (
        <BalanceDetails common={{...state_finance_common}} {...state_fc_balanceDetails}/>
    );
});