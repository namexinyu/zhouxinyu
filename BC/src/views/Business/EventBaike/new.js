import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import BaikeNew from './blocks/BaikeNew';

export default createPureComponent(({ state_business_bake, location, router }) => {
    return (<BaikeNew baikeInfo={state_business_bake} location={location} router={router} />);
});