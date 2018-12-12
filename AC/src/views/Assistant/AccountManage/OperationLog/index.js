import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import OperationLog from './blocks/OperationLog';

export default createPureComponent(({store_ac}) => {
   return (
     <OperationLog
        operationInfo={store_ac.state_ac_operation_log}
     />
   );
});
