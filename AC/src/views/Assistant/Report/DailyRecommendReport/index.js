import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import DailyRecommend from './blocks/DailyRecommend';

export default createPureComponent(({store_ac}) => {
   return (
     <DailyRecommend
       recommendInfo={store_ac.state_ac_daily_recommend}
     />
   );
});
