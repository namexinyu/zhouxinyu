import React from 'react';
import {Form, Row, Col, Button, Input, Select} from 'antd';
import {browserHistory} from 'react-router';
import setParams from "ACTION/setParams";

// 业务相关
import TabHubAddress from "./TabHubAddress";
import TabPickAddress from "./TabBoardingAddress";

export default class AddressManage extends React.PureComponent {
    constructor(props) {
        super(props);
        console.log('DispatchTrack props', props);
    }


    handleRefresh() {
        console.log('handleRefresh');
    }

    handleRefresh() {
        let data = this.props.stPage;
        setParams(data.state_name, {needRefresh: true});
    }

    handleGoPage(path) {
        browserHistory.push({
            pathname: path
        });
    }

    render() {
        let data = this.props.stPage;
        const fLayout = {
            labelCol: {span: 10},
            wrapperCol: {span: 14}
        };
        return (
            <div className='address-manage-view'>
                <div className='ivy-page-title'>
                    <div className="ivy-title">地址管理</div>
                     <span className="refresh-icon" onClick={() => this.handleRefresh()}>
                         <i className="iconfont icon-shuaxin"></i>
                     </span>
                    {/* <Button type='primary' className='title-btn'*/}
                    {/* onClick={() => this.handleGoPage('/ec/work-bench')}>返回*/}
                    {/* </Button>*/}
                </div>
                <div className="ivy-tab-line">
                    <div onClick={() => setParams(data.state_name, {currentTab: 'hub'})}
                         className={`tab-div ${data.currentTab == 'hub' ? 'current' : ''}`}>体验中心地址
                    </div>
                    <div onClick={() => setParams(data.state_name, {currentTab: 'boarding'})}
                         className={`tab-div ${data.currentTab == 'boarding' ? 'current' : ''}`}>上车地址
                    </div>
                </div>
                <TabHubAddress amHub={this.props.amHub}
                               location={this.props.location}
                               amHubEmployee={this.props.amHubEmployee}
                               stPage={this.props.stPage}></TabHubAddress>
                <TabPickAddress amBoarding={this.props.amBoarding}
                                location={this.props.location}
                                stPage={this.props.stPage}></TabPickAddress>
            </div>
        );
    }
}