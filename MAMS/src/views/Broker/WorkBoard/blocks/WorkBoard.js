import React from 'react';
import 'LESS/Broker/work-board.less';
import PageTitle from "COMPONENT/PageTitle";
import {Row, Col, Card} from 'antd';
import {ResponsiveContainer} from 'recharts';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import {browserHistory} from "react-router";
import getTodayTrackData from 'ACTION/Broker/WorkBoard/getTodayTrack';
import getTodayTrackSignData from 'ACTION/Broker/WorkBoard/getTodayTrackSign';
import getWeekData from 'ACTION/Broker/WorkBoard/getWeekData';
import moment from 'moment';


class WorkBoard extends React.PureComponent {
    constructor(props) {
        super(props);
        this.tag = new Date().getTime() - 4000;
    }

    componentWillMount() {
        this.handleRefresh();
    }

    handleRefresh() { // 刷新数据
        let now = new Date().getTime();
        if ((now - this.tag) > 3000) {
            getTodayTrackData({});
            getTodayTrackSignData({});
            getWeekData({});
            this.tag = now;
        }

    }

    handleGoPage(path) {
        browserHistory.push({
            pathname: path
        });
    }

    handleClickRoot(root) {
        browserHistory.push({pathname: root, query: {from: "board"}});
    }

    render() {
        const {todayTrack, todayTrackSign, weekData} = this.props;
        let WeekEntryList = weekData.WeekEntryList || [];

        let chartData = [];
        for (let i = 0, mom = moment(); i < 7; i++) {
            mom.subtract(1, 'd');
            // let date = mom.format('YYYY-MM-DD');
            let shortDate = mom.format('MM-DD');
            let week = mom.format('ddd');

            chartData.unshift({
                name: shortDate + ' ' + week,
                last_week: WeekEntryList[i]
            });
        }
        let todayTrackList = [
            {
                title: '今日预签到', footer: '未签到',
                baseCount: todayTrack.TodayPreCheckInCount,
                Count: todayTrack.TodayPreCheckInCount - todayTrack.TodayCheckInCount,
                handleClick: () => this.handleClickRoot('/broker/track/estimate-sign')
            },
            // {
            //     title: '今日签到', footer: '未面试',
            //     baseCount: todayTrack.TodayCheckInBaseCount,
            //     Count: todayTrack.TodayCheckInCount,
            //     handleClick: () => this.handleClickRoot('/broker/track/sign')
            // },
            {
                title: '今日面试', footer: '未联系',
                baseCount: todayTrack.TodayInterview,
                Count: todayTrackSign.InterviewCount,
                handleClick: () => this.handleGoPage('/broker/callback/interview')
            }
        ];
        let todayTrackSignList = [
            {
                title: '提醒工牌', footer: '需要提醒工牌人数',
                Count: todayTrackSign.WorkCardCount,
                handleClick: () => this.handleGoPage('/broker/callback/badge')
            },
            {
                title: '入职一周后', footer: '未联系',
                Count: todayTrackSign.EntryWeekCount,
                handleClick: () => this.handleGoPage('/broker/callback/week')
            }
        ];
        return (
            <div>
                <PageTitle title={<h1>{moment().format('YYYY-MM-DD') + ' 工作主页'}</h1>}
                           callRefresh={this.handleRefresh.bind(this)}/>

                <div className="container-fluid work-board-content pt-24 pb-24">
                    <div className="model-title">
                        <span className="model-title-icon"/><span>今日跟踪</span>
                    </div>
                    <Row>
                        {todayTrackList.map((item, index) => (
                            <Col xs={24} md={12} lg={8} key={index} style={{display: 'flex', justifyContent: 'center'}}>
                                <div className="work-item-container" onClick={item.handleClick}
                                     style={{cursor: "pointer"}}>
                                    <div className="work-item-title">{item.title}</div>
                                    <div className="work-item-value">{item.baseCount || 0}人</div>
                                    <div className="work-item-foot">
                                        <span>{item.footer}</span>
                                        <span>{item.Count || 0}人</span>
                                    </div>
                                </div>
                            </Col>
                        ))}
                    </Row>
                    {/*
                    <div className="model-title">
                        <span className="model-title-icon"/><span>服务回访</span>
                    </div>
                    <Row>
                        {todayTrackSignList.map((item, index) => (
                            <Col xs={24} md={12} lg={8} key={index} style={{display: 'flex', justifyContent: 'center'}}>
                                <div className="work-item-container" onClick={item.handleClick} style={{cursor: "pointer"}}>
                                    <div className="work-item-title">{item.title}</div>
                                    <div className="work-item-value-red">{item.Count || 0}人</div>
                                    <div className="work-item-foot-text">{item.footer}</div>
                                </div>
                            </Col>
                        ))}
                    </Row>*/}
                    <div className="model-title display-none">
                        <span className="model-title-icon"/><span>报表统计</span>
                    </div>
                    <Card bordered={false} className="display-none">
                        <Row type="flex" justify="start" className="report-card">
                            <Col sm={5} md={4} lg={3} className="report-card-count">
                                <div style={{textAlign: 'center'}}>
                                    <div>本月入职总数</div>
                                    <div>{weekData.MonthEntryCount}</div>
                                    <div>上周入职数量</div>
                                    <div>{weekData.LastWeekEntryCount}</div>
                                    <div>本周入职数量</div>
                                    <div>{weekData.WeekEntryCount}</div>
                                </div>
                            </Col>
                            <Col sm={19} lg={20}>
                                <ResponsiveContainer width="100%" aspect={2.5}>
                                    <LineChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3"/>
                                        <XAxis dataKey="name" padding={{left: 20, right: 20}}/>
                                        <YAxis label={{value: '数量:人', position: 'top', offset: 10}}/>
                                        <Tooltip/>
                                        <Legend verticalAlign="top" height={36}/>
                                        <Line dataKey="last_week" name="入职人数" stroke="#69bdc1" unit='人'/>
                                        {/* <Line dataKey="this_week" name="上周" stroke="#aaaaaa" unit='人'/>*/}
                                    </LineChart>
                                </ResponsiveContainer>
                            </Col>
                        </Row>
                    </Card>
                </div>
            </div>
        );
    }
}

export default WorkBoard;