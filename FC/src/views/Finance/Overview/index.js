import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import View from './View';

export default createPureComponent(({state_finance_overview, location, state_finance_common}) => {
    return (
        <View {...state_finance_overview}
              common={state_finance_common}
              location={location}/>
    );
});