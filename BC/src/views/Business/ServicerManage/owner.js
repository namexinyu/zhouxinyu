import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import Owner from './blocks/Owner';

export default createPureComponent(({ state_servicer_labor_boss_list, location }) => {
    return (
        <Owner {...state_servicer_labor_boss_list} location={{ ...location }} />
    );
});