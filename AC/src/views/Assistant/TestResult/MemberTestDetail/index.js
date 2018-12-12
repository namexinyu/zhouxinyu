import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import MemberTestDetail from './block/memberDetail';
export default createPureComponent(({store_ac, location, router}) => {
  return (
      <MemberTestDetail
          MeTestDetail={store_ac.state_ac_MeTestDetail}
          location={location}
          router={router}
      />
  );
});
