import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import BankCardContainer from './blocks/BankCardContainer';

export default createPureComponent(({store_audit, location}) => {
    return (
        <BankCardContainer list={store_audit.state_audit_bankCardList}
                           bankFilterList={[{BankID: 1, BankName: '测试银行一'}, {BankID: 2, BankName: '测试银行二'}, {BankID: 3, BankName: '测试银行三'}]}
                           detail={store_audit.state_audit_bankCardModal}
                           location={location}/>
    );
});
