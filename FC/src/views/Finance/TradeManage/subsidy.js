import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import SubsidyOrder from './Subsidy/SubsidyOrder';

export default createPureComponent(({state_finance_trade_subsidy_order, state_finance_common, location}) => {
    return (
        <SubsidyOrder {...state_finance_trade_subsidy_order}
                      common={state_finance_common}
                      location={location}/>
    );
});