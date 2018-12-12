import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import BatchSplit from './blocks/BatchSplit';

export default createPureComponent(({store_ac}) => {
  const {
    CertMemberInfo,
    BatchSplitParams
  } = store_ac.state_ac_belonging_split;
   return (
     <BatchSplit
        batchSplitInfo={{
          CertMemberInfo,
          BatchSplitParams
        }}
     />
   );
});
