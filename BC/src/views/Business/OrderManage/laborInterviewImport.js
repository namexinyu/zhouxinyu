import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import LaborInterviewImport from './LaborOrderManage/LaborInterviewImport';

export default createPureComponent(({state_business_labororder_interview_import, location, routeParams}) => {
    return (
        <LaborInterviewImport
            {...routeParams}
            {...state_business_labororder_interview_import}
            location={location}/>
    );
});