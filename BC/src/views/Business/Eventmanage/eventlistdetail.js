import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import EventlistDetail from './blocks/eventlistdetail';

export default createPureComponent(({ state_tabPage, state_mams_eventlistdetail, location, router}) => {
    return (<EventlistDetail tabPageInfo={state_tabPage} detail={state_mams_eventlistdetail} location={location} router={router}/>);
});