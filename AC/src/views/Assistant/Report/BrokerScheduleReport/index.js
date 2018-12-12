import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import BrokerSchedule from './blocks/BrokerSchedule';

export default createPureComponent(({store_ac}) => {
   return (
     <BrokerSchedule
       scheduleInfo={store_ac.state_ac_broker_schedule}
     />
   );
});
