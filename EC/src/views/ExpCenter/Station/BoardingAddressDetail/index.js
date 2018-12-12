import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import BoardingAddressDetail from './blocks/BoardingAddressDetail';

export default createPureComponent(({store_ec, location}) => {
    return (<BoardingAddressDetail bdAddrDetail={store_ec.state_ec_boardingAddressDetail}
                              location={location}/>);
});