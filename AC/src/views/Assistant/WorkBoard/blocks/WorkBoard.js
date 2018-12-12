import React from 'react';
import "LESS/pages/ac-board-view.less";
import {Form, Row, Col, Button, Input, Select, Table, Icon, DatePicker, message, Badge} from 'antd';
import SearchFrom from "COMPONENT/SearchForm/index";
import setParams from 'ACTION/setParams';
import resetQueryParams from 'ACTION/resetQueryParams';
import moment from 'moment';
import {browserHistory} from 'react-router';
// 业务相关
import BoardAction from 'ACTION/Assistant/BoardAction';
import AppSessionStorage from "CONFIG/SessionStorage/AppSessionStorage";
import {goToLogin} from "UTIL/HttpRequest/index";

export default class WorkBoard extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        if (window.env !== window.envs.dev && !AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('loginTimeTmp')) {
            alert('登录时间已过期，请重新登录');
            goToLogin();
        }
        BoardAction.GetAllCount({EmployeeID: AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('employeeId')});
    }


    handleRefresh() {
        BoardAction.GetAllCount({EmployeeID: AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('employeeId')});
        BoardAction.GetBrokerDepartList();
    }

    render() {
        const data = this.props.board.Count || {};
        return (
            <div className="ac-board-view">
                <div className="ivy-page-title" style={{position: 'relative'}}>
                    <h1>概况</h1>
                    <span className="i-refresh" onClick={() => this.handleRefresh()}>
                        <i className="iconfont icon-shuaxin"></i>
                    </span>
                </div>
                <div className="container-fluid mt-20">
                    <Row type="flex" justify="space-around">
                        <Col span={4} className="gutter-box">
                            <div className="count-container">
                                <div className="line-1">今日未处理待办</div>
                                <div className="line-2 clr-text-red">{data.MsgNotHandleCountToday || 0}</div>
                                <div className="line-3">{`已处理待办 : `}{data.MsgHandleCountToday || 0}</div>
                            </div>
                        </Col>
                        <Col span={4} className="gutter-box">
                            <div className="count-container">
                                <div className="line-1">今日预签到数</div>
                                <div className="line-2 clr-text-blue">{data.PreCheckinCountToday || 0}</div>
                                <div className="line-3">{`明日预签到数 : `}{data.PreCheckinCountTomorrow || 0}</div>
                            </div>
                        </Col>
                        <Col span={4} className="gutter-box">
                            <div className="count-container">
                                <div className="line-1">今日签到数</div>
                                <div className="line-2 clr-text-orange">{data.CheckinCountToday || 0}</div>
                                <div className="line-3">{`本月签到数 : `}{data.CheckinCountMonth || 0}</div>
                            </div>
                        </Col>
                        <Col span={4} className="gutter-box">
                            <div className="count-container">
                                <div className="line-1">今日面试数</div>
                                <div className="line-2 clr-text-purple">{data.InterviewCountToday || 0}</div>
                                <div className="line-3">{`本月面试数 : `}{data.InterviewCountMonth || 0}</div>
                            </div>
                        </Col>
                        <Col span={4} className="gutter-box">
                            <div className="count-container">
                                <div className="line-1">今日新增会员数</div>
                                <div className="line-2 clr-text-green">{data.UserNewCountToday || 0}</div>
                                <div className="line-3">{`本月新增会员数 : `}{data.UserNewCountMonth || 0}</div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>);
    }
}