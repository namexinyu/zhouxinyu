import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import SignList from "./blocks/SignList";

export default createPureComponent(({ store_broker, location, store_mams }) => {
    return (
        <SignList {...store_broker.state_today_sign}
                  AllRecruitListData={store_broker.state_broker_all_recruit}
                  hub_list = {store_broker.state_hub_list}
                  allRecruitList={{ ...store_mams.state_mams_recruitFilterList }}
                  location={location}/>
    );
});