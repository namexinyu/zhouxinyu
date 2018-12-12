import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import SignList from './blocks/SignList';

export default createPureComponent(({store_ec, store_mams, location}) => {
    return (<SignList sign={store_ec.state_ec_signList}
                      laborFilterList={store_ec.state_ec_laborFilterList.laborFilterList}
                      recruitFilterList={store_mams.state_mams_recruitFilterList.recruitFilterList}
                      recruitNameList={store_ec.state_ec_recruitNameList.recruitNameList}
                      refund={store_ec.state_ec_interviewRefund}
                      location={location}/>);
});