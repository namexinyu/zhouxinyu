import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import FactoryCheckin from './blocks/FactoryCheckin';

export default createPureComponent(({store_broker, location, store_mams}) => {
    return (<FactoryCheckin location={location}
                            list={store_broker.state_today_track_factory_checkin}
                            recruitFilterList={store_mams.state_mams_recruitFilterList.recruitFilterList}
                            AllRecruitListData={store_broker.state_broker_all_recruit}
                            recruitList={store_broker.state_broker_recruitNameList}/>);
});