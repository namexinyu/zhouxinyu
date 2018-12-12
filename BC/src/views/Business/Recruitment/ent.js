import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import EntManage from './entManage';

export default createPureComponent(({state_business_recruitment_ent, state_business_common, location}) => {
    return (
        <EntManage {...state_business_recruitment_ent} location={location} common={state_business_common}/>
    );
});