import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import MemberTest from './blocks/MemberTest';

export default createPureComponent(({store_ac, location}) => {
  return (
      <MemberTest
          MemTestListInfo={store_ac.state_ac_MemberTestResult}
          location={location}
      />
  );
});
