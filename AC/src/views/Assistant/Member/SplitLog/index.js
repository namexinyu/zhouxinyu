import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import SplitLog from './blocks/SplitLog';

export default createPureComponent(({store_ac}) => {
   return (
     <SplitLog
        splitLogInfo={store_ac.state_ac_belonging_split}
     />
   );
});
