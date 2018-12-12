import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import Eventstype from './blocks/eventstype';

export default createPureComponent(({ state_mams_eventstype }) => {
    return (<Eventstype dayEventInfo={state_mams_eventstype}/>);
});