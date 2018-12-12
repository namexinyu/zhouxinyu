import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import FactoryTestDetail from './block/factoryDetail';

export default createPureComponent(({store_ac, location, router}) => {
  return (
      <FactoryTestDetail
          factoryTestDetail={store_ac.state_ac_FactoryDetail}
          location={location}
          router={router}
      />
  );
});
