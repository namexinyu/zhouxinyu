import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import MemberList from './blocks/MemberList';

export default createPureComponent(({store_broker, location}) => {
    return (
        <MemberList {...store_broker.state_broker_memberList} location={location}/>
    );
});