import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import Exam from './blocks/Exam';

export default createPureComponent(({ store_broker, location }) => {
  return (<Exam accountInfo={store_broker.state_ac_GetUnFamiliarList}
    location={location} />);
});