import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import EventEntry from './blocks/evententry';

export default createPureComponent(({ store_mams, store_broker, location, router}) => {
    return (<EventEntry entry={store_broker.state_broker_entry} recruitFilterList={store_mams.state_mams_recruitFilterList.recruitFilterList} location={location} router={router} entrust={store_mams.state_mams_recruitmentEntrust}/>);
});