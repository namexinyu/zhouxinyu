import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import ComplainOrder from './ComplainOrderManage/ComplainOrder';

export default createPureComponent(({state_business_complainorder, state_business_common, location}) => {
    return (
        <ComplainOrder
            {...state_business_complainorder}
            common={state_business_common} location={location}/>
    );
});