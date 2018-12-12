import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import Busoffer from './blocks/Busoffer';

export default createPureComponent(({store_ec, store_mams}) => {
    return (<Busoffer busofferInfo={store_ec.state_ec_busoffer} busHubList={store_mams.state_mams_common.HubSimpleList} />);
});