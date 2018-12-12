import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import DispatchOrder from './DispatchOrder/DispatchOrder';

export default createPureComponent(({state_finance_trade_dispatch, location}) => {
    return (
        <DispatchOrder {...state_finance_trade_dispatch} location={location}/>
    );
});