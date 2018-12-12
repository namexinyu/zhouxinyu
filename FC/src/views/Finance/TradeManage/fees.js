import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import Fee from './Fee';

export default createPureComponent(({state_finance_trade_fee_bill, state_finance_trade_fee_detail, state_finance_trade_fee_settle, state_finance_common, location}) => {

    return (
        <Fee
            state_finance_trade_fee_detail={state_finance_trade_fee_detail}
            state_finance_trade_fee_bill={state_finance_trade_fee_bill}
            state_finance_trade_fee_settle={state_finance_trade_fee_settle}
            common={state_finance_common}
            location={location}
        />
    );
});