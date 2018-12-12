import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import GroupManage from './blocks/GroupManage';

export default createPureComponent(({store_ac}) => {
   return (
     <GroupManage
       groupInfo={store_ac.state_ac_group_manage}
     />
   );
});
