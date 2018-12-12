import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import WorkerCardContainer from './blocks/WorkerCardContainer';
export default createPureComponent(({ state_audit_workerCard_operate, location }) => {
    return (
        <div>
            <WorkerCardContainer {...state_audit_workerCard_operate} location={{ ...location }} />
        </div>
    );
});
