import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import LaborOrder from './LaborOrderManage/LaborOrder';

export default createPureComponent(({state_finance_trade_labor, state_finance_common, location}) => {
    return (
        <LaborOrder
            {...state_finance_trade_labor}
            common={state_finance_common}
            location={location}/>
    );
});