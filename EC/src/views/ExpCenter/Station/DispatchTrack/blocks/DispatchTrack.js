import React from 'react';
import {Form, Row, Col, Button, Input, Select} from 'antd';
import {browserHistory} from 'react-router';
import setParams from "ACTION/setParams";

// 业务相关
import DispatchTrackHistory from "./DispatchTrackHistory";
import DispatchTrackToday from "./DispatchTrackToday";
import getBrokerFilterList from "ACTION/ExpCenter/Broker/getBrokerFilterList";
import getDriverFilterList from "ACTION/ExpCenter/HubEmployee/getDriverFilterList";

export default class DispatchTrack extends React.PureComponent {
    constructor(props) {
        super(props);
        console.log('DispatchTrack props', props);
    }


    componentWillMount() {
        let broker = this.props.broker;
        if (!broker.brokerFilterList || broker.brokerFilterList.length == 0) {
            getBrokerFilterList();
        }
        let driver = this.props.driver;
        if (!driver.driverFilterList || driver.driverFilterList.length == 0) {
            getDriverFilterList();
        }
    }

    handleRefresh() {
        setParams(this.props.stPage.state_name, {needRefresh: true});
        getBrokerFilterList();
        getDriverFilterList();
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
        let today = this.props.dtToday;
        let queryParams = today.queryParams;
        return (
            <div className='dispatch-track-view'>
                <div className='ivy-page-title'>
                    <div className="ivy-title">派单追踪</div>
                    <span className="refresh-icon" onClick={() => this.handleRefresh()}>
                        <i className="iconfont icon-shuaxin"></i>
                    </span>
                    {/* <Button type='primary' className='title-btn'*/}
                    {/* onClick={() => this.handleGoPage('/ec/work-bench')}>返回*/}
                    {/* </Button>*/}
                </div>
                <div className="ivy-tab-line">
                    <div onClick={() => setParams(data.state_name, {currentTab: 'today', needRefresh: true})}
                         className={`tab-div ${data.currentTab == 'today' ? 'current' : ''}`}>今日派单
                    </div>
                    <div onClick={() => setParams(data.state_name, {currentTab: 'history', needRefresh: true})}
                         className={`tab-div ${data.currentTab == 'history' ? 'current' : ''}`}>历史派单
                    </div>
                </div>
                <DispatchTrackToday claim={this.props.dtClaim} broker={this.props.broker}
                                    location={this.props.location} driver={this.props.driver}
                                    today={this.props.dtToday} stPage={this.props.stPage}></DispatchTrackToday>
                <DispatchTrackHistory history={this.props.dtHistory} broker={this.props.broker}
                                      location={this.props.location} driver={this.props.driver}
                                      stPage={this.props.stPage}></DispatchTrackHistory>
            </div>
        );
    }
}