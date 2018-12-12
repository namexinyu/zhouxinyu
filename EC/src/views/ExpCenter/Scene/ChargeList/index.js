import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import ChargeList from './blocks/ChargeList';

// 123
export default createPureComponent(({store_ec, store_mams, location}) => {
    return (<ChargeList charge={store_ec.state_ec_chargeList}
                        laborFilterList={store_ec.state_ec_laborFilterList.laborFilterList}
                        recruitFilterList={store_mams.state_mams_recruitFilterList.recruitFilterList}
                        recruitNameList={store_ec.state_ec_recruitNameList.recruitNameList}
                        location={location}/>);
});