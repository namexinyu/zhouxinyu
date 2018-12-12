import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import LandManage from './blocks/LandManage';

export default createPureComponent(({store_ec}) => {
    return (<LandManage {...store_ec.state_ec_land_manage} {...store_ec.state_ec_new_account} {...store_ec.state_ec_bind_employee}/>);
});