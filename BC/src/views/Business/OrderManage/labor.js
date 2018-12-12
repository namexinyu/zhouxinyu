import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import LaborOrder from './LaborOrderManage/LaborOrder';

export default createPureComponent(({state_business_labororder, state_business_common, location}) => {
    return (
        <LaborOrder
            {...state_business_labororder}
            {...state_business_common}
            location={location}/>
    );
});