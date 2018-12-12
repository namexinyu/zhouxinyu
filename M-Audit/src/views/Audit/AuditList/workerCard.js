import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import WorkerCardContainer from './blocks/WorkerCardContainer';

export default createPureComponent(({store_audit, location}) => {
    return (
        <WorkerCardContainer list={store_audit.state_audit_workCardList}
                             detail={store_audit.state_audit_workCardModal}
                             EnterpriseSimpleList={store_audit.state_audit_common.EnterpriseSimpleList}
                             location={location}/>
    );
});
