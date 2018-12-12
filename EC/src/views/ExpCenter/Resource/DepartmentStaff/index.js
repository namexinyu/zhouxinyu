import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import DepartmentStaff from './blocks/DepartmentStaff';

export default createPureComponent(({store_ec}) => {
    return (<DepartmentStaff {...store_ec.state_ec_empHubList} {...store_ec.state_ec_employeeList}
                             {...store_ec.state_ec_departAllEmpName} {...store_ec.state_ec_accountChangeList}
                             setStatus = {store_ec.state_ec_setData}/>);
});