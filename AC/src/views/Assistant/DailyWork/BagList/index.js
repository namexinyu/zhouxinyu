import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import BagList from './blocks/BagList';

export default createPureComponent(({store_ac, store_mams}) => {
    return (
      <BagList
        bagListInfo={store_ac.state_ac_bag_list}
        allRecruitList={store_mams.state_mams_recruitFilterList.recruitFilterList}
        brokerInfo={store_mams.state_mams_employeeFilterList}
      />
    );
});
