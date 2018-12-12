import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import RecruitInfoDetail from './blocks/RecruitInfoDetail';

export default createPureComponent(({store_mams, location, router}) => {
    return (
        <RecruitInfoDetail recruitInfo={store_mams.state_mams_recruitmentList} router={router} location={location} />
    );
});