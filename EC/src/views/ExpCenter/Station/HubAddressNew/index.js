import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import HubAddressNew from './blocks/HubAddressNew';

export default createPureComponent(({store_ec, location}) => {
    return (<HubAddressNew hubNew={store_ec.state_ec_hubAddressNew}
                           hubEmployee = {store_ec.state_ec_hubEmployeeList}
                           location={location}/>);
});