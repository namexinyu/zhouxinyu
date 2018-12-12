import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import ManagerTransferLog from './blocks/ManagerTransferLog';


export default createPureComponent(({store_ac, location}) => {
    return (
        <ManagerTransferLog list={store_ac.state_ac_managerTransferLog} location={location}/>
    );
});