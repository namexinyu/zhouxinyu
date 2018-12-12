import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import PresignTrace from './blocks/removeMobile';

export default createPureComponent(({store_ac}) => {
    return (
      <PresignTrace
        list={store_ac.removeMobile}
      />
    );
});
