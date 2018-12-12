import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import StaffManage from './blocks/StaffManage';

export default createPureComponent(({store_ec}) => {
    return (<StaffManage {...store_ec.state_ec_employeeList} {...store_ec.state_ec_setData}/>);
});