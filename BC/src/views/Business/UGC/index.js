import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import UGC from './blocks';

export default createPureComponent(({state_business_ugc, location}) => {
    return (
        <UGC {...state_business_ugc} location={location}/>
    );
});