import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import AttendanceManage from './blocks/AttendanceManage';

export default createPureComponent(({store_ac, location}) => {
    return (<AttendanceManage list={store_ac.state_ac_attendanceList}
                              common={store_ac.state_ac_common}
                              location={location}/>);
});