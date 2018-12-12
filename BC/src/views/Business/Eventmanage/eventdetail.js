import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import EventDetail from './blocks/eventdetail';

export default createPureComponent(({ state_tabPage, state_mams_eventdetail, location, router}) => {
    return (<EventDetail tabPageInfo={state_tabPage} detail={state_mams_eventdetail} location={location} router={router}/>);
});