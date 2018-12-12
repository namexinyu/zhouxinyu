import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import LogContainer from './blocks/LogContainer';

export default createPureComponent(({ state_business_log, state_business_common, location, routeParams }) => {
    return (
        <LogContainer {...state_business_log} businessCommon={{ ...state_business_common }} routeParams={{ ...routeParams }} location={{ ...location }} />
    );
});