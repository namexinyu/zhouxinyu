import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import PresignTrace from './blocks/PresignTrace';

export default createPureComponent(({store_ac}) => {
    return (
      <PresignTrace
        presignTraceInfo={store_ac.state_ac_presign_trace}
      />
    );
});
