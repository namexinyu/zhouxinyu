import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import TodaySign from './blocks/TodaySign';

export default createPureComponent(({state_business_todaySign, state_business_common, location}) => {
    return (
        <TodaySign {...state_business_todaySign}
                   {...state_business_common}
                   location={location}
        />
    );
});