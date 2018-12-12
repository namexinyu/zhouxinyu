import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import HubAddressDetail from './blocks/HubAddressDetail';

export default createPureComponent(({store_ec, location}) => {
    return (<HubAddressDetail hubDetail={store_ec.state_ec_hubAddressDetail}
                              hubEmployee = {store_ec.state_ec_hubEmployeeList}
                              location={location}/>);
});