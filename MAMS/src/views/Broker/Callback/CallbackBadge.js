import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import CallbackBadge from './blocks/CallbackBadge';

export default createPureComponent(({store_mams, store_broker, location}) => {
    return (<CallbackBadge recruitList={store_broker.state_broker_recruitNameList}
                           recruitFilterList={store_mams.state_mams_recruitFilterList.recruitFilterList}
                           list={store_broker.state_broker_callbackBadge}
                           AllRecruitListData={store_broker.state_broker_all_recruit}
                           location={location} />);
});