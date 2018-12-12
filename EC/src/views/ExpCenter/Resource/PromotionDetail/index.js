import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import PromotionDetail from './blocks/PromotionDetail';

export default createPureComponent(({store_ec}) => {
    return (<PromotionDetail {...store_ec.state_ec_promotionDetail} />);
});