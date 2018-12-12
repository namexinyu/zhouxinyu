import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import Message from './blocks/message';

export default createPureComponent(({ store_mams, location, router}) => {
    return (<Message message={store_mams.state_ac_message} location={location} router={router}/>);
});