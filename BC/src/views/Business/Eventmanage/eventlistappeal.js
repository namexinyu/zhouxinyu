import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import Eventlistappeal from './blocks/eventlistappeal';

export default createPureComponent(({ state_mams_eventlistappeal, location, router}) => {
    return (<Eventlistappeal list={state_mams_eventlistappeal} location={location} router={router}/>);
});