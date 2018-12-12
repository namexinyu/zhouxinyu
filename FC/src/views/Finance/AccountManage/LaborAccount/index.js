import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import LaborAccount from './blocks/LaborAccount';

export default createPureComponent(({state_finance_common, state_fc_laborAccount, state_fc_laborComByBoss}) => {
    return (
        <LaborAccount common={state_finance_common} {...state_fc_laborAccount} {...state_fc_laborComByBoss}/>
    );
});