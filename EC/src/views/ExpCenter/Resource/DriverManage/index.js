import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import DriverManage from './blocks/DriverManage';

export default createPureComponent(({store_ec}) => {
    return (<DriverManage {...store_ec.state_ec_driverList} {...store_ec.state_ec_vehicleList} setStatus = {store_ec.state_ec_setData}/>);
});