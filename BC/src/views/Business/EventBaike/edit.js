import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import BaikeEdit from './blocks/BaikeEdit';

export default createPureComponent(({ state_business_bake, location, router }) => {
    return (<BaikeEdit baikeInfo={state_business_bake} location={location} router={router} />);
});