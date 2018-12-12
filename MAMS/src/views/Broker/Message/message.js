import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import Message from './blocks/message';

export default createPureComponent(({ store_broker, location, router}) => {
    return (<Message message={store_broker.state_mams_message} location={location} router={router}/>);
});