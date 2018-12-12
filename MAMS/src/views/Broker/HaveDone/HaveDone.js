import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import HaveDo from './blocks/HaveDone';


export default createPureComponent(({ store_broker }) => {
    return (
        <HaveDo {...store_broker.state_broker_have_done}/>
    );
});