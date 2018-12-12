import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import Settlement from './blocks/Settlement';

export default createPureComponent(({SettlementForm, store_mams, location, state_finance_common}) => {
    return (
        <Settlement entrust={store_mams.state_mams_recruitmentEntrust}
                        SettlementForm={SettlementForm}
                        common={state_finance_common}
                        list={store_mams.state_mams_recruitmentList}
                        require={store_mams.state_mams_recruitmentRequireInfo}
                        location={{...location}}/>
    );
});