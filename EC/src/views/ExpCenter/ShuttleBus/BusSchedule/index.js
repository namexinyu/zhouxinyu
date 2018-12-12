import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import BusSchedule from './blocks/BusSchedule';

export default createPureComponent(({reducersBusSchedule, store_mams}) => {
    return (<BusSchedule list={reducersBusSchedule} HubSimpleList={store_mams.state_mams_common.HubSimpleList}/>);
});