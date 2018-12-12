import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import EventqueryDetail from './blocks/eventquerydetail';

export default createPureComponent(({ state_tabPage, state_mams_eventquerydetail, location, router}) => {
    return (<EventqueryDetail tabPageInfo={state_tabPage} detail={state_mams_eventquerydetail} location={location} router={router}/>);
});