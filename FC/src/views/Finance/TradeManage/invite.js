import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import InviteOrder from './InviteOrder/InviteOrder';

export default createPureComponent(({state_finance_trade_invite, location}) => {
    return (
        <InviteOrder {...state_finance_trade_invite} location={location}/>
    );
});