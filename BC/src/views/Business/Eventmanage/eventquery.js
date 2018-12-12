import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import Eventquery from './blocks/eventquery';

export default createPureComponent(({ state_mams_eventquery, store_mams }) => {
    return (<Eventquery queryEventInfo={state_mams_eventquery} allRecruitList={store_mams.state_mams_recruitFilterList.recruitFilterList} />);
});

