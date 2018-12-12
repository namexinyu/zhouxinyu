import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
   import PerformancePK from './blocks/PerformancePK';

   export default createPureComponent(({store_ac, store_mams, location}) => {
       return (<PerformancePK list={store_ac.state_ac_performancePKList}
           // recruitFilterList={store_mams.state_mams_recruitFilterList.recruitFilterList}
                              location={location}/>);
   });