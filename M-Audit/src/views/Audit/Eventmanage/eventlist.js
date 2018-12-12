import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import EventList from './blocks/eventlist';

export default createPureComponent(({ state_broker_eventlist, state_mams_recruitFilterList, location }) => {
    return (<EventList eventListInfo={state_broker_eventlist} allRecruitList={state_mams_recruitFilterList.recruitFilterList} />);
});