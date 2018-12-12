import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import LoginContainer from './blocks/LoginContainer';
import Dialogs from 'COMPONENT/Dialog';

export default createPureComponent(({state_login, state_dialog}) => {
    return (
        <div>
            <LoginContainer {...state_login}/>
            <Dialogs items={state_dialog.dialogs}/>
        </div>
    );
});