import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import RecruitInfo from './blocks/RecruitInfo';

// 已废弃
export default createPureComponent(({store_ec, location}) => {
    return (<RecruitInfo recruitList={store_ec.state_ec_recruitList}
                         recruitNameList={store_ec.state_ec_recruitNameList}
                         recruit
                      location={location}/>);
});