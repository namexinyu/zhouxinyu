import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import DepartmentManage from './blocks/DepartmentManage';

export default createPureComponent(({store_ac}) => {
   return (
     <DepartmentManage
       departInfo={store_ac.state_ac_depart_manage}
     />
   );
});
