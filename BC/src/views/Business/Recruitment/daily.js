import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import DailyRecruit from './DailyRecruit';

export default createPureComponent(({state_business_recruitment_daily, state_business_common, location}) => {
    return (
        <DailyRecruit {...state_business_recruitment_daily} location={location} common={state_business_common}/>
    );
});