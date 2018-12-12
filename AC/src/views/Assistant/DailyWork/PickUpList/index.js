import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import PickUpList from './blocks/PickUpList';

export default createPureComponent(({store_ac, store_mams}) => {
    return (
      <PickUpList
        pickUpInfo={store_ac.state_ac_pickUpList}
        allRecruitList={store_mams.state_mams_recruitFilterList.recruitFilterList}
        brokerInfo={store_mams.state_mams_employeeFilterList}
      />
    );
});
