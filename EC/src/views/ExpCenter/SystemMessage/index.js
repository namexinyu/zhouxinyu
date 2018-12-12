import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import SystemMsg from './blocks/SystemMsg';

export default createPureComponent(({store_ec}) => {
    return (<SystemMsg {...store_ec.state_ec_systemMsg} {...store_ec.state_ec_empHubList}/>);
});