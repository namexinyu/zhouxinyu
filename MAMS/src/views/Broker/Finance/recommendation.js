import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import RecommendationList from './blocks/RecommendationList';

export default createPureComponent(({store_broker, store_mams, location}) => {
    return (<RecommendationList list={store_broker.state_broker_recommendationList}
                                asNew={store_mams.state_mams_assistanceNew}
                                recruitNameList={store_broker.state_broker_recruitNameList.recruitNameList}
                                location={location}/>);
});