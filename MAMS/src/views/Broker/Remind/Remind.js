import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import RemindPage from './blocks/RemindPage';

export default createPureComponent(({ store_broker, location }) => {
    return (<RemindPage remindUnread={store_broker.state_broker_remindUnRead}
                        remindHistory={store_broker.state_broker_remindHistory}
                        remindCount={store_broker.state_broker_timingTask.remindCount}
                    birth={store_broker.state_broker_birthDayRemind}
                    location={location} />);
});