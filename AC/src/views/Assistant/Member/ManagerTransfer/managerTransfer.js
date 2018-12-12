import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import ManagerTransfer from './blocks/ManagerTransfer';


export default createPureComponent(({store_ac, location}) => {
    return (
        <ManagerTransfer list={store_ac.state_ac_managerTransferInfo} location={location}/>
    );
});