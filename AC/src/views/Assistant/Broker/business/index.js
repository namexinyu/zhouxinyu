import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import Business from './blocks/business';

export default createPureComponent(({store_ec, store_mams, location}) => {
    return (<Business business={store_mams.state_ac_business} dataSourse={store_mams.state_mams_recruitFilterList}/>);
});

// departmentFilterList={store_mams.state_mams_departmentFilterList.departmentFilterList}