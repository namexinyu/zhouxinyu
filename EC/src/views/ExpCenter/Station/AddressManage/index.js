import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import AddressManage from './blocks/AddressManage';

export default createPureComponent(({store_ec, location}) => {
    return (<AddressManage stPage={store_ec.state_ec_addressManage}
                           amHub={store_ec.state_ec_hubAddressList}
                           amHubEmployee={store_ec.state_ec_hubEmployeeList}
                           amBoarding={store_ec.state_ec_boardingAddressList}
                           location={location}/>);
});