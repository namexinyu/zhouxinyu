import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import InterviewNameList from './InterviewNameList';

export default createPureComponent(({state_business_interview_namelist, state_business_common, location}) => {
    return (
        <InterviewNameList {...state_business_interview_namelist}
                   common={state_business_common}
                   location={location}/>
    );
});