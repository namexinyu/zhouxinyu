import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import MemberList from './blocks/MemberList';

export default createPureComponent(({store_ac, location}) => {
    return (<MemberList list={store_ac.state_ac_memberList}
                        transfer={store_ac.state_ac_managerTransferInfo}
                        location={location}/>);
});