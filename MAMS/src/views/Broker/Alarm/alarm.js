import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import Alarm from './blocks/Alarm';

export default createPureComponent(({store_broker, location}) => {
    return (
        <Alarm
            feature={store_broker.state_broker_header_alarm_feature}
            past={store_broker.state_broker_header_alarm_past}
            location={location}/>
    );
});