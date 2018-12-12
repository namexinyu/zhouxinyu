import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import StaffList from './blocks/StaffList';

export default createPureComponent(({ state_servicer_staff_list, state_business_common }) => {
    return (<StaffList staffListInfo={state_servicer_staff_list} common={state_business_common} />);
});