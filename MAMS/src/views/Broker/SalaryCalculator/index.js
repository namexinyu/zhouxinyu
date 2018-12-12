import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import SalaryCalculator from './blocks/SalaryCalculator';

export default createPureComponent(({store_broker}) => {
    return (
        <SalaryCalculator {...store_broker.state_broker_header_calculator} />
    );
});