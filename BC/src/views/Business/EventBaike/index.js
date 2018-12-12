import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import BaikeList from './blocks/BaikeList';

export default createPureComponent(({ state_business_bake, location, router }) => {
    return (<BaikeList baikeInfo={state_business_bake} location={location} router={router} />);
});