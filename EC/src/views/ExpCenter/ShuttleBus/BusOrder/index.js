import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import BusOrder from './blocks/BusOrder';

export default createPureComponent(({reducersBusOrder, store_mams}) => {
    return (<BusOrder list={reducersBusOrder} HubSimpleList={store_mams.state_mams_common.HubSimpleList}/>);
});