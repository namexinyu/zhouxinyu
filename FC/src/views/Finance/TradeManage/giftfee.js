import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import GiftFee from './GiftFee/GiftFee';

export default createPureComponent(({state_finance_trade_giftfee, location}) => {
    return (
        <GiftFee {...state_finance_trade_giftfee} location={location}/>
    );
});