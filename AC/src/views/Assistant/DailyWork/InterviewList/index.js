import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import InterviewList from './blocks/InterviewList';

export default createPureComponent(({store_ac, store_mams}) => {
   return (
     <InterviewList
       interviewInfo={store_ac.state_ac_interviewList}
       allRecruitList={store_mams.state_mams_recruitFilterList.recruitFilterList}
     />
   );
});
