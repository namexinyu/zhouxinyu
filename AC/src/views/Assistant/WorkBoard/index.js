import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import WorkBoard from './blocks/WorkBoard';

export default createPureComponent(({store_ac, location}) => {
    return (<WorkBoard board={store_ac.state_ac_board}
                       location={location}/>);
});