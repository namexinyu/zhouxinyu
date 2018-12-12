import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import OwnerEdit from './blocks/OwnerEdit';

export default createPureComponent(({ state_servicer_labor_boss_edit, location, routeParams }) => {
    return (
        <OwnerEdit {...state_servicer_labor_boss_edit} location={{ ...location }} routeParams={{ ...routeParams }} />
    );
});