import React from 'react';
import PageTitle from "COMPONENT/PageTitle";
import getTodaySign from "ACTION/Broker/TodaySign/Sign";
import getHubList from "ACTION/Broker/HubListInfo/HubListInfo";
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
let chooseTypes = [];
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
                if(i == "CheckinCloseStatus" && obj[i].length == chooseTypes.length * 2 - 1) {
                    continue;
                }
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

class SignList extends React.PureComponent {
    constructor(props) {
        super(props);

        OrderParams = this.props.OrderParams;
        chooseTypes = this.props.chooseTypes;
        this.STATE_NAME = 'state_today_sign';
        this.handleSelectedPage = this.handleSelectedPage.bind(this);
        this.handleChangeData = this.handleChangeData.bind(this);
        this.handleClickSummit = this.handleClickSummit.bind(this);
        this.handleSetParam = this.handleSetParam.bind(this);
        this.clickRefresh = this.clickRefresh.bind(this);
        this.resetData = this.resetData.bind(this);
        this.chooseType = this.chooseType.bind(this);
        this.changeOrder = this.changeOrder.bind(this);
    }

    componentWillMount() {
        initParams = Object.assign({}, this.props.QueryParams);
        getTodaySign(filterObject(this.props.QueryParams));
        getHubList();
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
        getTodaySign(filterObject(this.props.QueryParams));
    }
    handleChangeData(e) {
        let inputValue = e.target.value;
        if(e.target.name == "StopDate" && this.props.QueryParams.StartDate > inputValue) {
            alert("结束时间不能小于开始时间, 请重新设置！");
        }
        setParams(this.STATE_NAME, {QueryParams: Object.assign({}, this.props.QueryParams, {[e.target.name]: inputValue})});
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
        getTodaySign(filterObject(QueryParams));
    }
    handleSetParam(key, value, paramName = 'QueryParams') {
        let data = this.props;
        setParams(this.STATE_NAME, {[paramName]: Object.assign({}, data[paramName], {[key]: value})}); // TODO
    }
    clickRefresh() { // 刷新数据
        getTodaySign(filterObject(initParams));
        getHubList();
        getRecruitNameList();
        resetState(this.STATE_NAME);
    }

    resetData() {
        // resetState(this.STATE_NAME);
        // getHubList();
        // getRecruitNameList();
        // getTodaySign(filterObject(initParams));
        resetUserInforList(this.STATE_NAME);
    }
    chooseType(e) {
        let ChooseArr = this.props.chooseTypes;
        let TypeArr = this.props.QueryParams.CheckinCloseStatus;
        if (TypeArr.trim() == "") {
            TypeArr = [];
        }else{
            TypeArr = TypeArr.split(",");
        }
        if(e.target.checked && e.target.value) {
            TypeArr.push(e.target.value);
            ChooseArr[+e.target.value - 1].chooseType = true;
            setParams(this.STATE_NAME, {
                chooseTypes: ChooseArr
            });
            
            if(TypeArr.length == ChooseArr.length) {
                setParams(this.STATE_NAME, {
                    chooseAll: false
                });
            }
        }else if(e.target.value == "") {
            if(this.props.chooseAll) {
                for(let i = 0;i < ChooseArr.length;i++) {
                    ChooseArr[i].chooseType = true;
                }
                setParams(this.STATE_NAME, {
                    chooseTypes: ChooseArr,
                    chooseAll: false
                });
                TypeArr = this.props.chooseTypes.map((item, index)=>{
                    return (index + 1);
                });
            }else{
                for(let i = 0;i < ChooseArr.length;i++) {
                    ChooseArr[i].chooseType = false;
                }
                setParams(this.STATE_NAME, {
                    chooseTypes: ChooseArr,
                    chooseAll: true
                });
                TypeArr = [];
            }
        }else if(!e.target.checked) {
            ChooseArr[+e.target.value - 1].chooseType = false;
            setParams(this.STATE_NAME, {
                chooseTypes: ChooseArr
            });
            for(let i = 0;i < TypeArr.length;i++) {
                if(TypeArr[i] == e.target.value) {
                    TypeArr.splice(i, 1);
                    i--;
                }
            }
            setParams(this.STATE_NAME, {
                chooseAll: true
            });
        }
        TypeArr = TypeArr.join();
        setParams(this.STATE_NAME, {QueryParams: Object.assign({}, this.props.QueryParams, {CheckinCloseStatus: TypeArr})});
    }
    changeOrder(type) {
        let QueryParams = this.props.QueryParams;
        setParams(this.STATE_NAME, {
            OrderParams: Object.assign({}, this.props.OrderParams, {Order: type == "asc" ? 0 : type == "desc" ? 1 : null})
        });
        OrderParams.Order = type == "asc" ? 0 : type == "desc" ? 1 : null;
        getTodaySign(filterObject(QueryParams));
    }

    render() {
        let RecordCount = this.props.RecordCount;
        let estimateSignList = [];
        let hubList = (this.props.hub_list.HubList.Data && this.props.hub_list.HubList.Data.HubList) ? this.props.hub_list.HubList.Data.HubList : [];
        if(RecordCount) {
            estimateSignList = this.props.UserInforList;
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
                            <label className="col-form-label text-right">签到地址</label>
                        </div>
                        <div className="col-md-3">
                            <select className="form-control" name="CheckinHubID" onChange={this.handleChangeData} value={this.props.QueryParams.CheckinHubID}>
                                <option value="">请选择</option>
                                {
                                    hubList.map((item, index)=>{
                                        return(
                                            <option key={index} value={item.HubID}>{item.HubName}</option>
                                        );
                                    })
                                }
                            </select>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-1">
                            <label className="col-form-label text-right">签到状态</label>
                        </div>
                        <div className="col-md-7 need-do-type">
                            <span><input type="checkbox" onClick={this.chooseType} value="" checked={!this.props.chooseAll}/> 全选</span>&emsp;&emsp;
                            { this.props.chooseTypes.map((item, index)=>{
                                return(
                                    <span key={index} style={{marginRight: "20px"}}><input type="checkbox" checked={item.chooseType} onClick={this.chooseType} value={index + 1}/>{item.name}</span>
                                );
                            })}
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
                        <table className="table table-bordered">
                            <thead>
                            <tr>
                                <th>签到时间
                                    <Order order = {this.props.OrderParams.Order} clickOrder = {this.changeOrder}></Order>
                                </th>
                                <th>真实姓名</th>
                                <th>签到企业</th>
                                <th>签到地址</th>
                                <th>签到状态</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                estimateSignList.map((item, index)=>{
                                    return(
                                        <tr key={index} onClick={()=>this.handleClickUser(item.UserID, item.UserName)}>
                                            <td>{item.CheckinTime}</td>
                                            <td>{item.UserName}</td>
                                            <td>{item.CheckinRecruitName}</td>
                                            <td>{item.CheckinHubName}</td>
                                            <td>{item.CheckinCloseStatus ? stateObjs.CheckinCloseStatus[item.CheckinCloseStatus] : ""}</td>
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

export default SignList;