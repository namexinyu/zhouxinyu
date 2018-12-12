import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import BusType from './blocks/BusType';

export default createPureComponent(({reducersBusType}) => {
    return (<BusType list={reducersBusType}/>);
});