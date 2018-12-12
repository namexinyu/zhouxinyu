import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import LaborOrderInfo from './LaborOrderManage/LaborOrderInfo';

export default createPureComponent(({state_finance_trade_labor_info, location}) => {
    return (
        <LaborOrderInfo
            {...state_finance_trade_labor_info}
            location={location}/>
    );
});