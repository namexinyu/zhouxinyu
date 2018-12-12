import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import FactoryTest from './blocks/FactoryTest';
export default createPureComponent(({store_ac, location}) => {
    return (
        <FactoryTest
            FacTestListInfo={store_ac.state_ac_FactoryTestResult}
            location={location}
        />
    );
});
