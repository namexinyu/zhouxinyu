import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import UserOrder from './UserOrderManage/UserOrder';

export default createPureComponent(({state_finance_trade_user, state_finance_common, location}) => {
    return (
        <UserOrder {...state_finance_trade_user}
                   common={state_finance_common}
                   location={location}/>
    );
});