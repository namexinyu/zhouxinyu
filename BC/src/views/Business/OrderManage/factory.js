import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import FactoryReception from './LaborOrderManage/FactoryReception';

export default createPureComponent(({state_business_factory, state_business_common, location}) => {
    return (
        <FactoryReception
            {...state_business_factory}
            {...state_business_common}
            location={location}/>
    );
});