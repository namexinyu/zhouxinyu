import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import BoardContainer from './blocks/BoardContainer';

export default createPureComponent(({ state_audit_board }) => {
    return (
        <BoardContainer {...state_audit_board} />
    );
});
