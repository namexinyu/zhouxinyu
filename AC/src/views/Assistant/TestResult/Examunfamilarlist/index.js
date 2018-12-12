import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import Examunfamilar from './block/examunfarmilar';

export default createPureComponent(({ store_ac, location, router }) => {
  return (
    <Examunfamilar
      accountInfo={store_ac.state_ac_GetUnFamiliarList}
      location={location}
      router={router}
    />
  );
});
