import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import EventArrange from './blocks/eventarrange';

export default createPureComponent(({ state_mams_eventarrange, location, router}) => {
    return (<EventArrange list={state_mams_eventarrange} location={location} router={router}/>);
});