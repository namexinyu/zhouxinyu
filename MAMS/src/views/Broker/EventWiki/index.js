import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import Wiki from './blocks/Wiki';

export default createPureComponent(({ store_mams, store_broker, location, router}) => {
    return (<Wiki entry={store_broker.state_broker_entry} recruitFilterList={store_broker.state_broker_eventqueryWiki} location={location} router={router} entrust={store_mams.state_mams_recruitmentEntrust}/>);
});