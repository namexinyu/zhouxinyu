import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import PickUpReport from './blocks/PickUpReport';

export default createPureComponent(({store_ac, location}) => {
    return (<PickUpReport list={store_ac.state_ac_pickUpReportList}
                          location={location}/>);
});