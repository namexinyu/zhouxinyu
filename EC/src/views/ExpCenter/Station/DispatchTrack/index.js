import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import DispatchTrack from './blocks/DispatchTrack';

export default createPureComponent(({store_ec, location}) => {
    return (<DispatchTrack stPage={store_ec.state_ec_dispatchTrack}
                           hubFilter={store_ec.state_ec_hubNameList}
                       dtToday={store_ec.state_ec_dispatchTrackToday}
                       dtHistory={store_ec.state_ec_dispatchTrackHistory}
                       dtClaim={store_ec.state_ec_dispatchClaim}
                       broker={store_ec.state_ec_brokerFilterList}
                       driver={store_ec.state_ec_driverFilterList}
                       location={location}/>);
});