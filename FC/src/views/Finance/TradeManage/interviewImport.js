import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import InterviewImport from './Interview/InterviewImport';

export default createPureComponent(({state_finance_interview_import, state_finance_interview_red_import, state_finance_common, location, routeParams}) => {

    let red = routeParams.red;
    let props = red == 1 ? state_finance_interview_red_import : state_finance_interview_import;
    return (
        <InterviewImport {...props} location={location} red={red}/>
    );
});