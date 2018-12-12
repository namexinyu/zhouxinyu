import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import WorkBoard from './blocks/WorkBoard';

export default createPureComponent(({state_business_workBoard, location}) => {
    return (
        <WorkBoard {...state_business_workBoard}
                   location={location}
        />
    );
});