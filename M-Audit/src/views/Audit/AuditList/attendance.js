import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import AttendanceContainer from './blocks/AttendanceContainer';

export default createPureComponent(({store_audit, location}) => {
    return (
        <AttendanceContainer list={store_audit.state_audit_attendanceList}
                             detail={store_audit.state_audit_attendanceModal}
                             location={location}/>
    );
});
