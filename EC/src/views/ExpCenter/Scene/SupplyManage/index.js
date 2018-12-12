import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import SupplyManage from './blocks/SupplyManage';

export default createPureComponent(({store_ec, store_mams, location}) => {
    return (<SupplyManage supplyList={store_ec.state_ec_supplyReleaseList}
                          HubSimpleList={store_mams.state_mams_common.HubSimpleList}
                          recruitNameList={store_ec.state_ec_recruitNameList.recruitNameList}
                          recruitFilterList={store_mams.state_mams_recruitFilterList.recruitFilterList}
                          supplyDetail={store_ec.state_ec_supplyReleaseDetail}
                          supplyNew={store_ec.state_ec_supplyReleaseNew}
                          location={location}/>);
});