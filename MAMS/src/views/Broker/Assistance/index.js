import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import AssistancePage from './blocks/AssistancePage';

export default createPureComponent(({store_mams, store_broker, location}) => {
    return (<AssistancePage assistanceList={store_mams.state_mams_assistanceList}
                            assistanceListMy={store_mams.state_mams_assistanceListMy}
                            assistanceNew={store_mams.state_mams_assistanceNew}
                            assistanceDetail={store_mams.state_mams_assistanceDetail}
                            assistanceReplyList={store_mams.state_mams_assistanceReplyList}
                            employeeFilterList={store_mams.state_mams_employeeFilterList.employeeFilterList}
                            recruitNameList={store_broker.state_broker_recruitNameList.recruitNameList}
                            location={location}/>);
});

// departmentFilterList={store_mams.state_mams_departmentFilterList.departmentFilterList}