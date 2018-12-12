import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import StaffManage from './blocks/DutyBroker';

export default createPureComponent(({store_ec}) => {
    return (<StaffManage brockList = {store_ec.state_ec_brokerFilterList} {...store_ec.state_ec_brokersOnDuty} {...store_ec.state_ec_brokersOnDutyEdit} setStatus = {store_ec.state_ec_brokersOnDutyEdit}/>);
});