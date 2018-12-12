import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import DailyEmployed from './blocks/DailyEmployed';

export default createPureComponent(({store_ac}) => {
   return (
     <DailyEmployed
       employedInfo={store_ac.state_ac_daily_employed}
     />
   );
});
