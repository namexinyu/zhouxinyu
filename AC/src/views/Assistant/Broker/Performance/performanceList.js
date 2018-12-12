import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import PerformanceList from './blocks/PerformanceList';

export default createPureComponent(({store_ac, location}) => {
    return (<PerformanceList list={store_ac.state_ac_performanceList}
                             detail={store_ac.state_ac_performanceDetail}
                             location={location}/>);
});