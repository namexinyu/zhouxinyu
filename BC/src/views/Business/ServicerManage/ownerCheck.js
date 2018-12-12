import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import OwnerCheck from './blocks/OwnerCheck';

export default createPureComponent(({ state_servicer_labor_boss_check, location }) => {
    return (
        <OwnerCheck {...state_servicer_labor_boss_check} location={{ ...location }} />
    );
});