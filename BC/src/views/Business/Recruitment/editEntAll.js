import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import EditEntAll from './entManage/EditEntAll';

export default createPureComponent(({state_business_recruitment_ent_edit, state_business_common, location}) => {
    return (
        <EditEntAll state={state_business_recruitment_ent_edit[location.pathname + location.search]}
                    location={location}
                    common={state_business_common}/>
    );
});