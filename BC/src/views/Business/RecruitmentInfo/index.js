import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import RecruitmentInfo from './blocks/RecruitmentInfo';

export default createPureComponent(({store_mams, location}) => {
    return (
        <RecruitmentInfo entrust={store_mams.state_mams_recruitmentEntrust}
                         list={store_mams.state_mams_recruitmentList}
                         require={store_mams.state_mams_recruitmentRequireInfo}
                         location={{...location}}/>
    );
});