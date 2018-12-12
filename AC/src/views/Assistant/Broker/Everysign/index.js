import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import Everysign from './blocks/everysign';

export default createPureComponent(({store_ec, store_mams, location}) => {
    return (<Everysign everysign={store_mams.state_ac_Everysign}/>);
});

// departmentFilterList={store_mams.state_mams_departmentFilterList.departmentFilterList}