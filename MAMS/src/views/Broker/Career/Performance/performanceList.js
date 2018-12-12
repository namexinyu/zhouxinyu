import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import PerformanceList from './blocks/PerformanceList';

export default createPureComponent(({store_broker, location}) => {
    return (<PerformanceList list={store_broker.state_ac_performanceList}
                             detail={store_broker.state_ac_performanceDetail}
                             location={location}/>);
});