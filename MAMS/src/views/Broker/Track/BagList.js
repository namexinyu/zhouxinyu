import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import BagList from './blocks/BagList';

export default createPureComponent(({store_broker, location, store_mams}) => {
    return (<BagList location={location}
                     allRecruitList={{...store_mams.state_mams_recruitFilterList}}
                     AllRecruitListData={store_broker.state_broker_all_recruit}
                     recruitList={store_broker.state_broker_recruitNameList}
                     hub_list={store_broker.state_hub_list}
                     processInfo={store_broker.state_broker_member_detail_process}
                     pocketInfo={{...store_broker.state_broker_detail_pocket}}
                     {...store_broker.state_broker_recruit_basic}
                     {...store_broker.state_broker_bag_list}
                     faulch={store_broker.state_broker_member_detail_process}/>);
});
