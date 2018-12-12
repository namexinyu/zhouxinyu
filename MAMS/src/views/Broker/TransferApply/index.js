import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import TransferList from './blocks/TransferList';


export default createPureComponent(({store_broker, location}) => {
    return (
        <TransferList list={store_broker.state_broker_transferApplyList} location={location}/>
    );
});