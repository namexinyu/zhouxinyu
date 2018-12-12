import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import UserOrder from './UserOrderManage/UserOrder';

export default createPureComponent(({state_business_userorder, state_business_userorder_setlabor_modal, state_business_common, location}) => {
    return (
        <UserOrder {...state_business_userorder}
                   common={state_business_common}
                   setLaborModal={state_business_userorder_setlabor_modal}
                   location={location}/>
    );
});