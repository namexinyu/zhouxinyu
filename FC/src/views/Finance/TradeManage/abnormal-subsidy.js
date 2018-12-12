import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import SubsidyAbnormal from './SubsidyAbnormal';

export default createPureComponent(({state_finance_trade_subsidy_order_abnormal, state_finance_common, location}) => {
    return (
        <SubsidyAbnormal {...state_finance_trade_subsidy_order_abnormal} common={state_finance_common}
                         location={location}/>
    );
});