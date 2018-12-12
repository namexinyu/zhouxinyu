import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import DetailBlock from './blocks/DetailBlock';

export default createPureComponent(({ state_ac_memberDetail, location, router }) => {
    return (<DetailBlock {...state_ac_memberDetail} location={location} router={router} />);
});