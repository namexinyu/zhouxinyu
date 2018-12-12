import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import BusinessAffairss from './blocks/BusinessAffairs';

export default createPureComponent(({state_business_common, store_mams, location, BusinessAffairs, StoreList}) => {
    return (<BusinessAffairss assistanceList={store_mams.state_mams_assistanceList}
                            BusinessAffairs={BusinessAffairs}
                            StoreList={StoreList}
                            common={state_business_common}
                            assistanceListMy={store_mams.state_mams_assistanceListMy}
                            assistanceNew={store_mams.state_mams_assistanceNew}
                            assistanceDetail={store_mams.state_mams_assistanceDetail}
                            assistanceReplyList={store_mams.state_mams_assistanceReplyList}
                            employeeFilterList={store_mams.state_mams_employeeFilterList.employeeFilterList}
                            location={location}/>);
});
