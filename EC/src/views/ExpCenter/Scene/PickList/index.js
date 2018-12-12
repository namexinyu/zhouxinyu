import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import PickList from './blocks/PickList';

export default createPureComponent(({store_ec, location}) => {
    return (<PickList pick={store_ec.state_ec_pickUpList}
                      laborFilterList={store_ec.state_ec_laborFilterList.laborFilterList}
                      recruitNameList={store_ec.state_ec_recruitNameList.recruitNameList}
                      location={location}/>);
});