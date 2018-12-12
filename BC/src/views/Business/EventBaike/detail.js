import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import BaikeDetail from './blocks/BaikeDetail';

export default createPureComponent(({ state_business_bake, location, router }) => {
    return (<BaikeDetail location={location} router={router} />);
});