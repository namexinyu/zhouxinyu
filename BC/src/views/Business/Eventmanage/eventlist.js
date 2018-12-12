import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import EventList from './blocks/eventlist';

export default createPureComponent(({ state_mams_eventlist, store_mams, location, state_business_common }) => {
    return (<EventList eventListInfo={state_mams_eventlist} common={state_business_common} allRecruitList={store_mams.state_mams_recruitFilterList.recruitFilterList} location={location} />);
});