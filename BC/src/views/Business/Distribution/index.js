import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import Distributions from './blocks/Distribution';

export default createPureComponent(({state_business_common, store_mams, Distribution, location, StoreList}) => {
    return (<Distributions assistanceList={store_mams.state_mams_assistanceList}
                            common={state_business_common}
                            Distribution={Distribution}
                            StoreList={StoreList}
                            assistanceListMy={store_mams.state_mams_assistanceListMy}
                            assistanceNew={store_mams.state_mams_assistanceNew}
                            assistanceDetail={store_mams.state_mams_assistanceDetail}
                            assistanceReplyList={store_mams.state_mams_assistanceReplyList}
                            employeeFilterList={store_mams.state_mams_employeeFilterList.employeeFilterList}
                            location={location}/>);
});
