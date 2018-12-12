import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import Assign from './blocks/Assign';

export default createPureComponent(({state_business_recruit_assign, state_business_common, location, state_business_subsidy_setting}) => {
        return (
            <Assign {...state_business_recruit_assign}
                     businessCommon={state_business_common}
                     location={location}/>
        );
    }
)
;