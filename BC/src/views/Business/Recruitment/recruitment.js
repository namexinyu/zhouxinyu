import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import RecruimentCheck from './recruitment/RecruitmentCheck';

export default createPureComponent(({state_business_recruitmentcheck, state_business_common, location}) => {
    return (
        <RecruimentCheck {...state_business_recruitmentcheck}
        {...state_business_common}
        location={location} />
    );
});