import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import WorkBoard from './blocks/WorkBoard';


export default createPureComponent(({store_broker, location}) => {
    return (
        <WorkBoard
            location={location}
            {...store_broker.state_broker_workBoard} />
    );
});