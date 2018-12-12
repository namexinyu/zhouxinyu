import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import PreCount from './blocks/PreCount';

export default createPureComponent(({store_ec, location, store_mams}) => {
    return (<PreCount {...store_ec.state_ec_preCount} allRecruitList={{ ...store_mams.state_mams_recruitFilterList }}/>);
});