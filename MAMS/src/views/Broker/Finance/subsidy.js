import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import SubsidyList from './blocks/SubsidyList';

export default createPureComponent(({store_broker, store_mams, location}) => {
    return (<SubsidyList list={store_broker.state_broker_subsidyList}
                         asNew={store_mams.state_mams_assistanceNew}
                         recruitNameList={store_broker.state_broker_recruitNameList.recruitNameList}
                         location={location}/>);
});