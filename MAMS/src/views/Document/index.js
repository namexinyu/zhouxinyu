import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import Doc from './blocks/DocList';

export default createPureComponent(({ state_docHome }) => {
    return (<Doc {...state_docHome} />);
});