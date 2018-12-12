import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import EntAudit from './entManage/entAudit';

export default createPureComponent(({state_business_recruitment_ent_audit, state_business_common, location}) => {
    return (
        <EntAudit {...state_business_recruitment_ent_audit} location={location} common={state_business_common}/>
    );
});