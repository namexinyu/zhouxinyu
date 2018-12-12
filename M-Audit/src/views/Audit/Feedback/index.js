import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import FeedbackList from './blocks/FeedbackList';

export default createPureComponent(({ store_audit, store_mams }) => {
    return (<FeedbackList feedbackListInfo={store_audit.state_audit_feedback_list} departGroupList={store_mams.state_mams_departgroup_list.departGroupList} />);
});