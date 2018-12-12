import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import NeedDoList from './blocks/NeedDoList';

export default createPureComponent(({store_ac, location}) => {
    return (<NeedDoList list={store_ac.state_ac_needDoAllList}
                        location={location}/>);
});