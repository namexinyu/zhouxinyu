import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import Test from './blocks/Test';

export default createPureComponent(({state_business_recruit_mirror, state_business_common}) => {
        return (
            <Test {...state_business_common}/>
        );
    }
)
;