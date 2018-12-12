import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import SalaryCalculator from './blocks/SalaryCalculator';

export default createPureComponent(({store_ec}) => {
    return (
        <SalaryCalculator {...store_ec.state_broker_header_calculator} />
    );
});