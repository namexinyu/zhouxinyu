import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import CallbackEntry from './blocks/CallbackEntry';

export default createPureComponent(({store_audit, state_common, location}) => {
    return (
        <CallbackEntry list={store_audit.state_audit_callbackEntryList}
                       listByUser={store_audit.state_audit_callbackEntryListByUser}
                       RecruitSimpleList={state_common.RecruitSimpleList}
                       location={location}/>
    );
});
