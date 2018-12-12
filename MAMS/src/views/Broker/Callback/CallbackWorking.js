import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import CallbackWorking from './blocks/CallbackWorking';

export default createPureComponent(({store_mams, store_broker, location}) => {
    return (<CallbackWorking recruitList={store_broker.state_broker_recruitNameList}
                             recruitFilterList={store_mams.state_mams_recruitFilterList.recruitFilterList}
                             list={store_broker.state_broker_callbackWorking}
                             AllRecruitListData={store_broker.state_broker_all_recruit}
                             location={location} />);
});