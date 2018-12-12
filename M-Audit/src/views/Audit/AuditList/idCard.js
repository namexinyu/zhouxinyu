import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import IDCardContainer from './blocks/IDCardContainer';

export default createPureComponent(({store_audit, location}) => {
    return (
        <IDCardContainer list={store_audit.state_audit_idCardList}
                         detail={store_audit.state_audit_idCardModal}
                         location={location}/>
    );
});
