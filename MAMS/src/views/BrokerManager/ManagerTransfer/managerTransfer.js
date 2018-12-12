import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import ManagerTransfer from './blocks/ManagerTransfer';


export default createPureComponent(({store_broker}) => {
    return (
        <ManagerTransfer list={store_broker.state_bm_managerTransferInfo}/>
    );
});