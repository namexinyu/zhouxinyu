import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import MemberNeed from './blocks/memberNeed';

export default createPureComponent(({store_mams}) => {
    return (<MemberNeed memberNeedInfo={store_mams.state_ac_memberneed}/>);
});