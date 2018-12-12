import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import Interview from "./blocks/Interview";

export default createPureComponent(({store_mams, store_broker, location}) => {
    return (
        <Interview {...store_broker.state_today_Interview}
                   asNew={store_mams.state_mams_assistanceNew}
                   AllRecruitListData={store_broker.state_broker_all_recruit}
                   recruitNameList={store_broker.state_broker_recruitNameList.recruitNameList}
                   labelData={store_broker.state_broker_workBoard}
                   allRecruitList={{ ...store_mams.state_mams_recruitFilterList }} location={location}
                   {...store_broker.state_broker_interview_status}/>
    );
});