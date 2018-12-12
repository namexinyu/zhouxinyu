import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import SignInterviewCount from './blocks/SignInterviewCount';

export default createPureComponent(({store_ac, location}) => {
    return (<SignInterviewCount list={store_ac.state_ac_signInterviewCount}
                          location={location}/>);
});