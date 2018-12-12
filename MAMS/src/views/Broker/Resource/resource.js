import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import Resource from './blocks/Resource';

export default createPureComponent(({store_broker, location}) => {
    return (
        <Resource {...store_broker.state_broker_header_resource} location={location}/>
    );
});