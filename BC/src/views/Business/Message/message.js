import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import Message from './blocks/message';

export default createPureComponent(({ state_mams_message, location, router}) => {
    return (<Message message={state_mams_message} location={location} router={router}/>);
});