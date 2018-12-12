import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import Penny from './blocks/Penny';

export default createPureComponent(({state_finance_penny, location}) => {
    return (
        <Penny {...state_finance_penny} location={location}/>
    );
});