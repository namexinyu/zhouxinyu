import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import EventList from './blocks/eventlist';

export default createPureComponent(({ store_broker, store_mams, location }) => {
    return (<EventList eventListInfo={store_broker.state_broker_eventlist} recruitFilterList={store_mams.state_mams_recruitFilterList.recruitFilterList} location={location} />);
});