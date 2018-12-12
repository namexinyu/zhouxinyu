import React from 'react';
import Entrepot from "COMPONENT/Entrepot";
import 'LESS/pages/workBench.less';
import {Row, Col, Alert, DatePicker, Button, Select} from 'antd';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts";
import getSystemWarning from 'ACTION/WorkBoard/getSystemWarning';
import getDispatchInfo from 'ACTION/WorkBoard/getDispatchInfo';
import getCheckinInfo from 'ACTION/WorkBoard/getCheckinInfo';
import getLaborPickupInfo from 'ACTION/WorkBoard/getLaborPickupInfo';
import getAmountInfo from 'ACTION/WorkBoard/getAmountInfo';
import getSevenDayInfo from 'ACTION/WorkBoard/getSevenDayInfo';
import AppSessionStorage from "CONFIG/SessionStorage/AppSessionStorage";
import getHistoryDispatchInfo from 'ACTION/WorkBoard/getHistoryDispathInfo';
import getHistoryCheckinInfo from 'ACTION/WorkBoard/getHistoryCheckinInfo';
import getHistoryLaborPickupInfo from 'ACTION/WorkBoard/getHistoryLaborPickupInfo';
import getHistoryAmountInfo from 'ACTION/WorkBoard/getHistoryAmountInfo';
import getReimbursement from 'ACTION/ExpCenter/Reimbursement';
import getDeposit from 'ACTION/ExpCenter/Deposit';
import setParams from 'ACTION/setParams';
const Option = Select.Option;

import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const { RangePicker } = DatePicker;
let EmployeeID = null;
const HubIDListALL = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('HubIDList');

export default class TestPage extends React.PureComponent {
    constructor(props) {
        super(props);
        this.HubIDListALL = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('HubIDList');
        this.HubManager = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('role').indexOf("HubManager") != -1;
        this.state = {
            tab: 1,
            StartTime: getTime(-90),
            EndTime: getTime(0),
            HubIDListC: this.HubIDListALL,
            HubIDListH: this.HubIDListALL,
            valueC: "",
            valueH: ""
        };
        this.STATE_NAME = "state_ec_sevenDayInfo";
        this.handleTabModel = this.handleTabModel.bind(this);
        this.handleChangeCurrent = this.handleChangeCurrent.bind(this);
        this.handleChangeHistory = this.handleChangeHistory.bind(this);
        this.onChanges = this.onChanges.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.init = this.init.bind(this);
    }
    componentWillMount() {
        EmployeeID = AppSessionStorage.getEmployeeID();
        this.HubList = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('HubList');
        this.init();

    }
    init() {
        let currentTime = getTime(0);
        getDispatchInfo({StartTime: currentTime, EndTime: currentTime, HubIDList: this.HubIDListALL});
        getCheckinInfo({StartTime: currentTime, EndTime: currentTime, HubIDList: this.HubIDListALL});
        getLaborPickupInfo({StartTime: currentTime, EndTime: currentTime, HubIDList: this.HubIDListALL});
        getAmountInfo({StartTime: currentTime, EndTime: currentTime, HubIDList: this.HubIDListALL});
        getDeposit({StartTime: currentTime, EndTime: currentTime, HubIDList: this.HubIDListALL});
        getReimbursement({HubIDList: this.HubIDListALL});
        getSevenDayInfo({HubIDList: this.HubIDListALL});
        getSystemWarning({HubIDList: this.HubIDListALL});
        getHistoryDispatchInfo({StartTime: getTime(-90), EndTime: getTime(0), HubIDList: this.HubIDListALL});
        getHistoryCheckinInfo({StartTime: getTime(-90), EndTime: getTime(0), HubIDList: this.HubIDListALL});
        getHistoryLaborPickupInfo({StartTime: getTime(-90), EndTime: getTime(0), HubIDList: this.HubIDListALL});
        getHistoryAmountInfo({StartTime: getTime(-90), EndTime: getTime(0), HubIDList: this.HubIDListALL});
    }
    handleTabModel(state) {
        this.setState({
            tab: state
        });
    }
    handleChangeCurrent(value) {
        let StartTime = getTime(0);
        let EndTime = getTime(0);
        getDispatchInfo({StartTime: StartTime, EndTime: EndTime, HubIDList: value ? [Number(value)] : this.HubIDListALL});
        getCheckinInfo({StartTime: StartTime, EndTime: EndTime, HubIDList: value ? [Number(value)] : this.HubIDListALL});
        getLaborPickupInfo({StartTime: StartTime, EndTime: EndTime, HubIDList: value ? [Number(value)] : this.HubIDListALL});
        getAmountInfo({StartTime: StartTime, EndTime: EndTime, HubIDList: value ? [Number(value)] : this.HubIDListALL});
        getSevenDayInfo({HubIDList: value ? [Number(value)] : this.HubIDListALL});
        getReimbursement({HubIDList: value ? [Number(value)] : this.HubIDListALL});
        // by albert
        // 原消息接口中存放了明日预签到数字,所以放到此处和其他数字一同更新
        getSystemWarning({HubIDList: value ? [Number(value)] : this.HubIDListALL});
        this.setState({
            valueC: value
        });
    }
    handleChangeHistory(value) {
        this.setState({
            HubIDListH: value ? [Number(value)] : this.HubIDListALL,
            valueH: value
        });
    }

    onChanges(value, dateString) {
        this.setState({
            StartTime: dateString[0],
            EndTime: dateString[1]
        });
    }
    handleSearch() {
        let StartTime = this.state.StartTime;
        let EndTime = this.state.EndTime;
        let HubIDList = this.state.HubIDListH;
        getHistoryDispatchInfo({StartTime: StartTime, EndTime: EndTime, HubIDList: HubIDList});
        getHistoryCheckinInfo({StartTime: StartTime, EndTime: EndTime, HubIDList: HubIDList});
        getHistoryLaborPickupInfo({StartTime: StartTime, EndTime: EndTime, HubIDList: HubIDList});
        getHistoryAmountInfo({StartTime: StartTime, EndTime: EndTime, HubIDList: HubIDList});
    }
    handleRefresh() {
        this.init();
        this.setState({
            valueC: "",
            valueH: "",
            StartTime: getTime(-90),
            EndTime: getTime(0)
        });
    }
    render() {
        return (
            <div>
                <div className='ivy-page-title'>
                    <div className="ivy-title">体验中心概况</div>
                    <span className="refresh-icon" onClick={() => this.handleRefresh()}>
                         <i className="iconfont icon-shuaxin"></i>
                    </span>
                </div>
                <div className="tab-child-component">
                    <div className={this.state.tab == 1 ? "active" : ""} onClick={()=>this.handleTabModel(1)}>今日情况</div>
                    <div className={this.state.tab == 2 ? "active" : ""} onClick={()=>this.handleTabModel(2)}>历史情况</div>
                </div>
                <div className="board-content" style={{display: this.state.tab == 1 ? "block" : "none"}}>
                    <div style={{display: this.HubList.length > 1 ? "block" : "none", margin: "15px 0", textAlign: 'left'}}>
                        <Select
                            placeholder="全部体验中心"
                            style={{ width: 200 }}
                            size="large"
                            value={this.state.valueC}
                            onChange={this.handleChangeCurrent}
                        >
                            <Option value="">全部体验中心</Option>
                            {
                                (this.HubList || []).map((item, index)=>{
                                    return(
                                        <Option key={index} value={item.HubID + ""}>{item.HubName}</Option>
                                    );
                                })
                            }
                        </Select>
                    </div>
                    { this.HubManager ? "" : <Alert message={"系统提醒：明日预计签到人数达到 " + this.props.TomorwPreCheckCount + " 人，请工作人员提前做好接待准备工作!"} type="info" />}
                    <Row className="h-100">
                        <Col span={5} className="h-100 board-card">
                            <div className="card-title">待处理派单数</div>
                            <div className="card-wait-number">{this.props.WaitDispatchCount}</div>
                            <div>
                                <Col span={16} className="h-100 text-left pl-20">
                                    <span className="cart-title-list">已处理派单数</span>
                                </Col>
                                <Col span={8} className="h-100">
                                    <span>{this.props.DispatchCount}</span>
                                </Col>
                            </div>
                            <div>
                                <Col span={16} className="h-100 text-left pl-20">
                                    <span className="cart-title-list">总派单数</span>
                                </Col>
                                <Col span={8} className="h-100">
                                    <span>{this.props.DispatchCount + this.props.WaitDispatchCount}</span>
                                </Col>
                            </div>
                        </Col>
                        <Col span={1} className="h-100">
                        </Col>
                        <Col span={5} className="h-100 board-card">
                            <div className="card-title">已签到人数</div>
                            <div className="card-wait-number">{this.props.CheckinCount}</div>
                            <div>
                                <Col span={16} className="h-100 text-left pl-20">
                                    <span className="cart-title-list">今日预计签到人数</span>
                                </Col>
                                <Col span={8} className="h-100">
                                    <span>{this.props.PreCheckinCount}</span>
                                </Col>
                            </div>
                            <div>
                                <Col span={16} className="h-100 text-left pl-20">
                                    <span className="cart-title-list">明日预计签到人数</span>
                                </Col>
                                <Col span={8} className="h-100">
                                    <span>{this.props.TomorwPreCheckCount}</span>
                                </Col>
                            </div>
                        </Col>
                        <Col span={1} className="h-100">
                        </Col>
                        <Col span={5} className="h-100 board-card" style={{height: "192px"}}>
                            <div className="card-title">等待劳务接走人数</div>
                            <div className="card-wait-number">{this.props.WaitPickupCount}</div>
                            <div>
                                <Col span={16} className="h-100 text-left pl-20">
                                    <span className="cart-title-list">劳务已接人数</span>
                                </Col>
                                <Col span={8} className="h-100">
                                    <span>{this.props.PickupCount}</span>
                                </Col>
                            </div>
                            {/* <div>*/}
                                {/* <Col span={16} className="h-100 text-left pl-20">*/}
                                    {/* <span className="cart-title-list">未面试人数</span>*/}
                                {/* </Col>*/}
                                {/* <Col span={8} className="h-100">*/}
                                    {/* <span>{this.props.GiveupCount}</span>*/}
                                {/* </Col>*/}
                            {/* </div>*/}
                        </Col>
                        <Col span={1} className="h-100">
                        </Col>
                        <Col span={5} className="h-100 board-card" style={{height: "277px"}}>
                            <div className="card-title">今日应交账金额</div>
                            <div className="card-wait-number">{(this.props.GetTotalAmount + this.props.AmountDeposit - this.props.ClaimMoney - this.props.ReturnAmount) / 100}元</div>
                            <div>
                                <Col span={16} className="h-100 text-left pl-20">
                                    <span className="cart-title-list">签到净收费金额</span>
                                </Col>
                                <Col span={8} className="h-100">
                                    <span>{(this.props.GetTotalAmount / 100) - (this.props.ReturnAmount / 100)}元</span>
                                </Col>
                            </div>
                            <div>
                                <Col span={16} className="h-100 text-left pl-20">
                                    <span className="cart-title-list">物品发放净押金</span>
                                </Col>
                                <Col span={8} className="h-100">
                                    <span>{this.props.AmountDeposit / 100}元</span>
                                </Col>
                            </div>
                            <div>
                                <Col span={16} className="h-100 text-left pl-20">
                                    <span className="cart-title-list">车费报销金额</span>
                                </Col>
                                <Col span={8} className="h-100">
                                    <span>{this.props.ClaimMoney / 100}元</span>
                                </Col>
                            </div>
                        </Col>
                        <Col span={1} className="h-100">
                        </Col>
                    </Row>
                    <ResponsiveContainer width="90%" height={360}>
                        <LineChart data={ this.props.SevenDayList ? this.props.SevenDayList : [] }
                                   margin={{ top: 50, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" name="预签到人数" dataKey="PreCheckinCount" stroke="#D9D9D9" />
                            <Line type="monotone" name="签到人数" dataKey="CheckinCount" stroke="#1890FF" />
                            <Line type="monotone" name="面试人数" dataKey="InterviewCount" stroke="#00488A" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div className="board-content" style={{display: this.state.tab == 2 ? "block" : "none"}}>
                    <Row className="h-100">
                        <Col span={6} className="h-100" style={{width: 'auto', marginRight: '20px'}}>
                            {/* <Entrepot change={this.handleChangeHistory} dateList = {this.HubList || []}></Entrepot>*/}
                            <div style={{display: this.HubList.length > 1 ? "block" : "none", textAlign: 'left'}}>
                                <Select
                                    placeholder="全部体验中心"
                                    style={{ width: 200 }}
                                    size="large"
                                    value={this.state.valueH}
                                    onChange={this.handleChangeHistory}
                                >
                                    <Option value="">全部体验中心</Option>
                                    {
                                        (this.HubList || []).map((item, index)=>{
                                            return(
                                                <Option key={index} value={item.HubID + ""}>{item.HubName}</Option>
                                            );
                                        })
                                    }
                                </Select>
                            </div>
                        </Col>
                        <Col span={6} className="h-100">
                            <RangePicker
                                disabledDate={disabledDate}
                                size="large"
                                style={{fontSize: "16px"}}
                                format="YYYY-MM-DD"
                                placeholder={['起始时间', '结束时间']}
                                onChange={this.onChanges}
                                value={[moment(this.state.StartTime, 'YYYY/MM/DD'), moment(this.state.EndTime, 'YYYY/MM/DD')]}
                            />
                        </Col>
                        <Col span={2} className="h-100">
                            <div style={{lineHeight: "32px"}}>
                                <Button type="primary" onClick={this.handleSearch}>查询</Button>
                            </div>
                        </Col>
                    </Row>
                    <Row className="h-100">
                        <Col span={6} className="h-100 board-card board-card-two">
                            <div className="card-title">已送达派单数</div>
                            <div className="card-wait-number">{this.props.SuccessDispatchCountH}</div>
                        </Col>
                        <Col span={6} className="h-100">
                        </Col>
                        <Col span={6} className="h-100 board-card board-card-two">
                            <div className="card-title">签到人数</div>
                            <div className="card-wait-number">{this.props.CheckinCountH}</div>
                        </Col>
                        <Col span={6} className="h-100">
                        </Col>

                    </Row>
                    <Row className="h-100">
                        <Col span={6} className="h-100 board-card board-card-two">
                            <div className="card-title">劳务接走人数</div>
                            <div className="card-wait-number">{this.props.PickupCountH}</div>
                        </Col>
                        <Col span={6} className="h-100">
                        </Col>
                        <Col span={6} className="h-100 board-card" style={{height: "192px"}}>
                            <div className="card-title">收取报名费总计</div>
                            <div className="card-wait-number">{this.props.GetTotalAmountH / 100}元</div>
                            <div>
                                <Col span={16} className="h-100">
                                    <span className="cart-title-list">退费总计</span>
                                </Col>
                                <Col span={8} className="h-100">
                                    <span>{this.props.ReturnAmountH / 100}元</span>
                                </Col>
                            </div>
                        </Col>
                        <Col span={6} className="h-100">
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}


function disabledDate(current) { // TODO这里有个权限限制
    // Can not select days before today and today
    var nowdate = new Date();
    nowdate.setDate(nowdate.getDate() - 91);
    return current && current.valueOf() > Date.now() || current.valueOf() < nowdate.valueOf();
}
function getTime(time) {
    let nowdate = new Date();
    nowdate.setDate(nowdate.getDate() + time);
    return nowdate.getFullYear() + "-" + changeNumStyle(+nowdate.getMonth() + 1) + "-" + changeNumStyle(nowdate.getDate());

}
function changeNumStyle(num) {
    return num <= 9 ? '0' + num : num;
}