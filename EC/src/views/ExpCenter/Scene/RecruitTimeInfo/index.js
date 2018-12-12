import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import RecruitTimeInfo from './blocks/RecruitTimeInfo';

export default createPureComponent(({store_ec, location}) => {
    return (<RecruitTimeInfo recruitList={store_ec.state_ec_recruitTimeList}
                         recruitNameList={store_ec.state_ec_recruitNameList}
                         recruit
                      location={location}/>);
});