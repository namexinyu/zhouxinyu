import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import BusRenter from './blocks/BusRenter';

export default createPureComponent(({reducersBusRenter, store_mams}) => {
    return (<BusRenter list={reducersBusRenter}/>);
});