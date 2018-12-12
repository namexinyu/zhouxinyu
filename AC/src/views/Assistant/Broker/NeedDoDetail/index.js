import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import NeedDo from './blocks/index';


export default createPureComponent(({store_ac, location}) => {
    return (
        <NeedDo needDo={store_ac.state_ac_needDoList} location={location}
                havenDone={store_ac.state_ac_haveDoneList}/>
    );
});