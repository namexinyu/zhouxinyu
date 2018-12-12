import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import CarManage from './blocks/CarManage';

export default createPureComponent(({store_ec, location}) => {
    return (<CarManage list={store_ec.state_ec_vehicleInfoList}
                       detail={store_ec.state_ec_vehicleInfoDetail}
                       location={location}/>);
});