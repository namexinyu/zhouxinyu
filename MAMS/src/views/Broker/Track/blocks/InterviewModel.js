import React from 'react';
import PageTitle from "COMPONENT/PageTitle";
import getTodayInterview from "ACTION/Broker/TodayInterview/Interview";
import {browserHistory} from 'react-router';
import setParams from 'ACTION/setParams';
import resetState from 'ACTION/resetState';
import SelectableInput from 'COMPONENT/SelectableInput/index';
import getRecruitNameList from 'ACTION/Broker/Recruit/getRecruitNameList';
import Pagination from 'COMPONENT/Pagination';
import resetUserInforList from "ACTION/Broker/xddResetList";
import Order from "COMPONENT/Order";
import stateObjs from "VIEW/StateObjects";


// TODO 废弃的模板

let initParams = {};
let OrderParams = {};
function filterObject(obj) {
    let wrapObj = {};
    if(isArray(obj) == "Object") {
        var returnObj = [];
        for(let i in obj) {
            if(isArray(obj[i]) == "Object" && Object.keys(obj[i]).length == 0) {
                continue;
            }else if(isArray(obj[i]) == "Array" && obj[i].length == 0) {
                continue;
            }else{
                if(i == "CheckinRecruitID" && obj[i] != 0) {
                    if(obj[i]) {
                        let lobj = {};
                        lobj.Key = i;
                        lobj.Value = obj[i].toString();
                        returnObj.push(lobj);
                    }
                    continue;
                }
                if(i == "RecordIndex" || i == "RecordSize") {
                    wrapObj[i] = obj[i];
                }else if(obj[i]) {
                    let lobj = {};
                    lobj.Key = i;
                    lobj.Value = obj[i];
                    returnObj.push(lobj);
                }
            }
        }
        wrapObj.QueryParams = returnObj;
        wrapObj.OrderParams = OrderParams;
        return(wrapObj);
    }
    return obj;
}
function isArray(o) {
    return Object.prototype.toString.call(o).slice(8, -1);
}

class Interview extends React.PureComponent {
    constructor(props) {
        super(props);

        OrderParams = this.props.OrderParams;
        this.STATE_NAME = 'state_today_Interview';
        this.handleSelectedPage = this.handleSelectedPage.bind(this);
        this.handleChangeData = this.handleChangeData.bind(this);
        this.handleClickSummit = this.handleClickSummit.bind(this);
        this.clickRefresh = this.clickRefresh.bind(this);
        this.handleSetParam = this.handleSetParam.bind(this);
        this.resetData = this.resetData.bind(this);
        this.changeOrder = this.changeOrder.bind(this);
    }

    componentWillMount() {
        initParams = Object.assign({}, this.props.QueryParams);
        getTodayInterview(filterObject(this.props.QueryParams));
        getRecruitNameList();
    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {

    }

    componentWillUpdate(nextProps, nextState) {

    }

    componentDidUpdate() {

    }

    componentWillUnmount() {

    }
    handleClickUser(id, name) {
        if(id) {
            browserHistory.push({
                pathname: '/broker/member/detail/' + id,
                query: {
                    memberName: name
                }
            });
        }
    }
    handleSelectedPage(page) {
        let dataSize = this.props.pageSize;
        let QueryParams = this.props.QueryParams;
        setParams(this.STATE_NAME, {
            currentPage: page,
            QueryParams: Object.assign({}, this.props.QueryParams, {RecordIndex: (page - 1) * dataSize})
        });
        QueryParams.RecordIndex = (page - 1) * dataSize;
        getTodayInterview(filterObject(this.props.QueryParams));
    }
    handleChangeData(e) {
        if(e.target.name == "StopDate" && this.props.QueryParams.StartDate > e.target.value) {
            alert("结束时间不能小于开始时间, 请重新设置！");
        }

        if(e.target.name == "InterviewStatus" && e.target.value) {
            setParams(this.STATE_NAME, {QueryParams: Object.assign({}, this.props.QueryParams, {"InterviewStatus": e.target.value.split(",")[0], "LaborListStatus": e.target.value.split(",")[1]})});
            return;
        }
        if(e.target.name == "HireStatus" && e.target.value) {
            setParams(this.STATE_NAME, {QueryParams: Object.assign({}, this.props.QueryParams, {"HireStatus": e.target.value.split(",")[0], "HireLaborListStatus": e.target.value.split(",")[1]})});
            return;
        }
        setParams(this.STATE_NAME, {QueryParams: Object.assign({}, this.props.QueryParams, {[e.target.name]: e.target.value})});
    }
    handleSetParam(key, value, paramName = 'QueryParams') {
        let data = this.props;
        setParams(this.STATE_NAME, {[paramName]: Object.assign({}, data[paramName], {[key]: value})});
    }
    handleClickSummit() {
        let QueryParams = this.props.QueryParams;
        if(QueryParams.UserMobile.length != 11 && QueryParams.UserMobile != "") {
            alert("电话号码输入错误!");
            return;
        }
        if(QueryParams.StopDate < QueryParams.StartDate) {
            alert("结束时间不能小于开始时间, 请重新设置！");
            return;
        }
        QueryParams.RecordIndex = 0;
        setParams(this.STATE_NAME, {
            currentPage: 1
        });

         // InterviewStatus HireStatus
        getTodayInterview(filterObject(QueryParams));
    }
    clickRefresh() { // 刷新数据
        getTodayInterview(filterObject(initParams));
        getRecruitNameList();
        resetState(this.STATE_NAME);
    }

    resetData() {
        // resetState(this.STATE_NAME);
        // getRecruitNameList();
        // getTodayInterview(filterObject(initParams));
        resetUserInforList(this.STATE_NAME);
        let HireStatus = document.getElementById("HireStatus");
        let InterviewStatus = document.getElementById("InterviewStatus");
        HireStatus.value = "";
        InterviewStatus.value = "";
    }
    changeOrder(type) {
        let QueryParams = this.props.QueryParams;
        setParams(this.STATE_NAME, {
            OrderParams: Object.assign({}, this.props.OrderParams, {Order: type == "asc" ? 0 : type == "desc" ? 1 : null})
        });
        OrderParams.Order = type == "asc" ? 0 : type == "desc" ? 1 : null;
        getTodayInterview(filterObject(QueryParams));
    }

    render() {
        let RecordCount = this.props.RecordCount;
        let UserInforList = [];
        if(RecordCount) {
            UserInforList = this.props.UserInforList;
        }
        return (
            <div>
                <PageTitle title="签到名单" callRefresh = {this.clickRefresh}></PageTitle>
                <div className="container-fluid search-reset bg-white">
                    <div className="row">
                        <div className="col-md-1">
                            <label className="col-form-label text-right">签到日期</label>
                        </div>
                        <div className="col-md-3">
                            <input type="date" name="StartDate" value={this.props.QueryParams.StartDate} onChange={this.handleChangeData} className="form-control search-date"/>
                        </div>
                        <div className="col-md-1">
                        </div>
                        <div className="col-md-3" style={{position: "relative", left: "-8%"}}>
                            <input type="date" name="StopDate" onChange={this.handleChangeData} value={this.props.QueryParams.StopDate} className="form-control search-date"/>
                        </div>
                        <div className="col-md-1">
                            <label className="col-form-label text-right">会员姓名</label>
                        </div>
                        <div className="col-md-3">
                            <input type="text" name="UserName" onChange={this.handleChangeData} value={this.props.QueryParams.UserName} className="form-control" placeholder="请输入会员姓名"/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-1">
                            <label className="col-form-label text-right">会员电话</label>
                        </div>
                        <div className="col-md-3">
                            <input type="text" name="UserMobile" onChange={this.handleChangeData} value={this.props.QueryParams.UserMobile} className="form-control" placeholder="请输入会员电话"/>
                        </div>
                        <div className="col-md-1">
                            <label className="col-form-label text-right">签到企业</label>
                        </div>
                        <SelectableInput
                            onSelecteData={(id) => this.handleSetParam('CheckinRecruitID', id)}
                            onChangeData={(val) => this.handleSetParam('RecruitTmp', val, 'otherParams')}
                            dataArr={this.props.recruitList.recruitNameList}
                            iptValue={this.props.otherParams.RecruitTmp}
                            iptID={this.props.QueryParams.CheckinRecruitID}
                            iptOptions={{
                                placeholder: '请输入企业',
                                keyParam: 'RecruitID',
                                valParam: 'RecruitName',
                                className: "col-md-3"
                            }}></SelectableInput>
                        <div className="col-md-1">
                            <label className="col-form-label text-right">面试结果</label>
                        </div>
                        <div className="col-md-3">
                            <select className="form-control" id="InterviewStatus" name="InterviewStatus" onChange={this.handleChangeData}>
                                <option value="">全部</option>
                                <option value="1,1">未有名单</option>
                                <option value="1,2">不在名单</option>
                                <option value="2,3">面试通过</option>
                                <option value="3,3">面试不通过</option>
                                <option value="4,3">放弃面试</option>
                            </select>
                        </div>

                    </div>
                    <div className="row">
                        <div className="col-md-1">
                            <label className="col-form-label text-right">工牌状态</label>
                        </div>
                        <div className="col-md-3">
                            <select className="form-control" value={this.props.QueryParams.WorkCardStatus} onChange={this.handleChangeData} name="WorkCardStatus">
                                <option value="">全部</option>
                                <option value="1">审核中</option>
                                <option value="2">审核通过</option>
                                <option value="3">审核失败</option>
                                <option value="4">未上传</option>
                            </select>
                        </div>
                        <div className="col-md-1">
                            <label className="col-form-label text-right">补贴倒计时</label>
                        </div>
                        <div className="col-md-3">
                            <select className="form-control search-title-five" value={this.props.QueryParams.CountdownStatus} onChange={this.handleChangeData} name="CountdownStatus">
                                <option value="">全部</option>
                                <option value="1">进行中</option>
                                <option value="2">已结束</option>
                                <option value="3">未进行</option>
                            </select>
                        </div>
                        <div className="col-md-1">
                            <label className="col-form-label text-right">申请补贴</label>
                        </div>
                        <div className="col-md-3">
                            <select className="form-control" value={this.props.QueryParams.SubsidyStatus} onChange={this.handleChangeData} name="SubsidyStatus">
                                <option value="">全部</option>
                                <option value="1">未领取</option>
                                <option value="2">已领取</option>
                                <option value="3">领取失败</option>
                            </select>
                        </div>

                    </div>
                    <div className="row">
                        <div className="col-md-1">
                            <label className="col-form-label text-right">在离职状态</label>
                        </div>
                        <div className="col-md-3">
                            <select className="form-control search-title-five" id="HireStatus" onChange={this.handleChangeData} name="HireStatus">
                                <option value="">全部</option>
                                <option value="1,1">未有名单</option>
                                <option value="1,2">不在名单</option>
                                <option value="2,3">在职</option>
                                <option value="3,3">离职</option>
                                <option value="4,3">放弃入职</option>
                            </select>
                        </div>
                        <div className="col-md-1">
                            <label className="col-form-label text-right">申诉状态</label>
                        </div>
                        <div className="col-md-3">
                            <select className="form-control search-title-five" value={this.props.QueryParams.ComplainStatus} onChange={this.handleChangeData} name="ComplainStatus">
                                <option value="">全部</option>
                                <option value="1">申诉中</option>
                                <option value="2">申诉失败</option>
                                <option value="3">申诉成功</option>
                            </select>
                        </div>
                        <div className="col-md-4">
                            <div className="row">
                                <div className="col-md-6">
                                    <button className="btn btn-warning btn-block" onClick={this.resetData}>重置</button>
                                </div>
                                <div className="col-md-6">
                                    <button className="btn btn-info btn-block" onClick={this.handleClickSummit}>确认</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container-fluid table-model bg-white">
                    <div>
                        <table className="table table-bordered table-sm">
                            <thead>
                            <tr>
                                <th>签到时间
                                    <Order order = {this.props.OrderParams.Order} clickOrder = {this.changeOrder}></Order>
                                </th>
                                <th>真实姓名</th>
                                {/* <th>手机号码</th>*/}
                                <th>签到企业</th>
                                <th>补贴快照</th>
                                <th>面试结果</th>
                                <th>最新面试回访</th>
                                <th>工牌</th>
                                <th>补贴倒计时</th>
                                <th>申请补贴状态</th>
                                <th>在离职状态</th>
                                <th>申诉状态</th>
                                <th>到账补贴金额</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                UserInforList.map((item, index)=>{
                                    return(
                                        <tr key={index} onClick={()=>this.handleClickUser(item.UserID, item.UserName)}>
                                            <td>{item.CheckinTime}</td>
                                            <td>{item.UserName}</td>
                                            {/* <td>{item.UserMobile}</td>*/}
                                            <td>{item.CheckinRecruitName}</td>
                                            <td>{item.SubsidyDetail}</td>
                                            <td>{
                                                item.InterviewStatus == 1 && item.LaborListStatus == 1 ? "未有名单" : item.InterviewStatus == 1 && item.LaborListStatus == 2 ? "不在名单" : item.InterviewStatus == 2 && item.LaborListStatus == 3 ? "面试通过" : item.InterviewStatus == 3 && item.LaborListStatus == 3 ? "面试不通过" : item.InterviewStatus == 4 && item.LaborListStatus == 3 ? "放弃面试" : ""
                                            }</td>
                                             <td>{item.CallbackContent}</td>
                                            <td>{
                                                item.WorkCardStatus ? stateObjs.WorkCardStatus[item.WorkCardStatus] : ""
                                            }</td>
                                            <td>{
                                                item.CountdownStatus ? stateObjs.CountdownStatus[item.CountdownStatus] : ""
                                            }</td>
                                            <td>{
                                                item.SubsidyStatus ? stateObjs.SubsidyStatus[item.SubsidyStatus] : ""
                                            }</td>
                                            <td>{
                                                item.HireStatus == 1 && item.HireLaborListStatus == 1 ? "未有名单" : item.HireStatus == 1 && item.HireLaborListStatus == 2 ? "不在名单" : item.HireStatus == 2 && item.HireLaborListStatus == 3 ? "在职" : item.HireStatus == 3 && item.HireLaborListStatus == 3 ? "离职" : item.HireStatus == 4 && item.HireLaborListStatus == 3 ? "放弃" : ""
                                            }</td>
                                            <td>{
                                                item.ComplainStatus ? stateObjs.ComplainStatus[item.ComplainStatus] : ""
                                            }</td>
                                            <td>{Number.isInteger(item.AccountSubsidy) ? item.AccountSubsidy / 100 : ''}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>

                        </table>
                    </div>

                </div>
                <div className="bg-white container-fluid" style={{paddingTop: "20px", "overflow": "hidden"}}>

                    <Pagination totalSize={this.props.RecordCount}
                                pageSize={this.props.pageSize}
                                afterSelectedPage={this.handleSelectedPage}
                                initPage={this.props.currentPage}/>
                </div>
            </div>
        );
    }
}


export default Interview;