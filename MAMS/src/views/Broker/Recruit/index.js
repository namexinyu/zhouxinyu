import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import Recruit from './blocks/Recruit';

export default createPureComponent(({ store_broker, location, router}) => {
    return (<Recruit recruitList={store_broker.state_broker_recruitList}
                     recruitBug={store_broker.state_broker_recruitCommitBug}
                     matchPhone={store_broker.state_broker_recruitMatchPhone}
                     departmentList={store_broker.state_broker_departmentNameList}
                     location={location} router={{...router}} />);
});