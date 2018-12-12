import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import WorkBenchContent from './blocks/WorkBenchContent';

export default createPureComponent(({store_ec}) => {
    return (<WorkBenchContent {...store_ec.state_ec_systemWarning} {...store_ec.state_ec_dispatchInfo}
                              {...store_ec.state_ec_checkinInfo} {...store_ec.state_ec_laborPickupInfo}
                              {...store_ec.state_ec_amountInfo} {...store_ec.state_ec_sevenDayInfo}
                              {...store_ec.state_ec_empHubList} {...store_ec.state_ec_historyDispatchInfo}
                              {...store_ec.state_ec_historyCheckinInfo} {...store_ec.state_ec_historyLaborPickupInfo}
                              {...store_ec.state_ec_historyAmountInfo} {...store_ec.state_ec_reimbursement} {...store_ec.state_ec_deposit}/>);
});