import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import LaborOrderInfo from './LaborOrderManage/LaborOrderInfo';

export default createPureComponent(({state_business_labororder_info, state_business_common, location}) => {
    return (
        <LaborOrderInfo
            {...state_business_labororder_info}
            common={state_business_common} location={location}/>
    );
});