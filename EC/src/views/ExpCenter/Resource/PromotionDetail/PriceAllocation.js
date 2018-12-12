import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import PriceAllocation from './blocks/PriceAllocation';

export default createPureComponent(({store_ec}) => {
    return (<PriceAllocation {...store_ec.state_ec_priceAllocation} setStatus = {store_ec.state_ec_setData}/>);
});