import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import CooperationList from './blocks/CooperationList';

export default createPureComponent(({ state_business_cooperation }) => {
    return (<CooperationList cooperationInfo={state_business_cooperation} />);
});