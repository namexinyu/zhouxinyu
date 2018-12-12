import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import OwnerCreate from './blocks/OwnerCreate';

export default createPureComponent(({ state_servicer_labor_boss_create, location, routeParams }) => {
    return (
        <OwnerCreate {...state_servicer_labor_boss_create} location={{ ...location }} routeParams={{ ...routeParams }} />
    );
});