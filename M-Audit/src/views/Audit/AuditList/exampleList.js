import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import ExampleListContainer from './blocks/ExampleListContainer';

export default createPureComponent(({ state_audit_example_list, location, state_common }) => {
    return (
        <div>
            <ExampleListContainer {...state_audit_example_list} commonState={{...state_common}} location={{ ...location }} />
        </div>
    );
});
