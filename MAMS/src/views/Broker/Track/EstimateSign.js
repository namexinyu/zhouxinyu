import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import EstimateSign from "./blocks/EstimateSign";

export default createPureComponent(({ store_broker, location, store_mams, state_common_store_list }) => {
  return (
    <EstimateSign {...store_broker.state_today_track_estimate_sign}
      personInfo={store_broker.state_broker_member_person_post_info}
      allRecruitList={{ ...store_mams.state_mams_recruitFilterList }}
      AllRecruitListData={store_broker.state_broker_all_recruit}
      recruitList={store_broker.state_broker_recruitNameList}
      hub_list={store_broker.state_hub_list}
      storeList={{ ...state_common_store_list }}
      processInfo={store_broker.state_broker_member_detail_process}
      pocketInfo={{ ...store_broker.state_broker_detail_pocket }}
      {...store_broker.state_broker_recruit_basic}
      faulch={store_broker.state_broker_member_detail_process}
      {...store_broker.state_today_track_pre_signNum}
      {...store_broker.state_broker_delete_preSign}
      location={location} />
  );
});
