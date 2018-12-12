import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import Eventserve from './blocks/eventserve';

export default createPureComponent(({ state_mams_eventserve }) => {
    return (<Eventserve dayServiceInfo={state_mams_eventserve}/>);
});