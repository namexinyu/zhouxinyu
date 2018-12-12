import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import BoardingAddressNew from './blocks/BoardingAddressNew';

export default createPureComponent(({store_ec, location}) => {
    return (<BoardingAddressNew bdAddrNew={store_ec.state_ec_boardingAddressNew}
                           location={location}/>);
});