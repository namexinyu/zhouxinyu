import React from 'react';
import SystemInfoList from './blocks/SystemInfoList';
import PageTitle from 'COMPONENT/PageTitle';
import createPureComponent from 'UTIL/createPureComponent';
import resetState from 'ACTION/resetState';
import {getHeaderSystemInfo} from 'ACTION/Broker/Header/SystemInfo';

export default createPureComponent(({store_broker, location}) => {
    const handleCallRefresh = () => {
        resetState("state_broker_header_systemInfo");
        getHeaderSystemInfo();
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <PageTitle title="系统消息" callRefresh={handleCallRefresh}/>
            </div>
            <div className="row">
                <SystemInfoList {...store_broker.state_broker_header_systemInfo} location={location}/>
            </div>
        </div>
    );
});