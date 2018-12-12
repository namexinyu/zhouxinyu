import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import InterviewReport from './blocks/InterviewReport';

export default createPureComponent(({store_ac, location}) => {
    return (<InterviewReport list={store_ac.state_ac_interviewReportList}
                             location={location}/>);
});