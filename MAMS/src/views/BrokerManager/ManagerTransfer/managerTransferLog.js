import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import ManagerTransferLog from './blocks/ManagerTransferLog';


export default createPureComponent(({store_broker, location}) => {
    return (
        <ManagerTransferLog list={store_broker.state_bm_managerTransferLog} location={location}/>
    );
});