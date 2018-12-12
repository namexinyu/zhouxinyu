import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import AttendanceContainer from './blocks/AttendanceContainer';

export default createPureComponent(({ state_audit_attendance_operate, location }) => {
    return (
        <div>
            <AttendanceContainer {...state_audit_attendance_operate} location={{ ...location }} />
        </div>
    );
});
