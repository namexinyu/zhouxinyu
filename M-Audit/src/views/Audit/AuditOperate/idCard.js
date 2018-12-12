import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import IdCardContainer from './blocks/IdCardContainer';

export default createPureComponent(({ state_audit_idCard_operate, location }) => {
    return (
        <IdCardContainer {...state_audit_idCard_operate} location={{ ...location }} />
    );
});
