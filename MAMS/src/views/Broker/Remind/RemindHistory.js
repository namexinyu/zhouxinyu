import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import RemindHistory from './blocks/RemindHistory';

export default createPureComponent(({ store_broker, location }) => {
    return (<RemindHistory remindHistory={store_broker.state_broker_remindHistory}
                           location={location}/>);
});