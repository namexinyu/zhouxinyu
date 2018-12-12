import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import EventList from './blocks/eventlist';

export default createPureComponent(({ state_mams_eventlist, store_mams }) => {
    console.log(store_mams.state_mams_recruitFilterList.recruitFilterList, "555555555555555555555");
    return (<EventList eventListInfo={state_mams_eventlist} allRecruitList={store_mams.state_mams_recruitFilterList.recruitFilterList} />);
});