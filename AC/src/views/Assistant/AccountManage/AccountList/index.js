import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import AccountList from './blocks/AccountList';

export default createPureComponent(({store_ac}) => {
   return (
     <AccountList
       accountInfo={store_ac.state_ac_account_manage}
     />
   );
});
