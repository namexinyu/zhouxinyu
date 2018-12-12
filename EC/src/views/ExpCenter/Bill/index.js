import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import BillList from './blocks/BillList';

// 123
export default createPureComponent(({store_ec, location}) => {
    return (<BillList list={store_ec.state_ec_billList}
                        location={location}/>);
});