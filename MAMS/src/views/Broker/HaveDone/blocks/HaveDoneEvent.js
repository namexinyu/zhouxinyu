import React from 'react';
import getHaveDoneData from 'ACTION/Broker/HaveDone/HaveDoneData';
import PageTitle from "COMPONENT/PageTitle";
import {browserHistory} from 'react-router';
import Pagination from 'COMPONENT/Pagination';
import resetState from 'ACTION/resetState';
import setParams from 'ACTION/setParams';
import resetUserInforList from "ACTION/Broker/xddResetList";
import stateObjs from "VIEW/StateObjects";

let initParams = {};
let chooseTypeArr = [];
function filterObject(obj) {
    let wrapObj = {};
    if(isArray(obj) == "Object") {
        for(let i in obj) {
            if(isArray(obj[i]) == "Array" && obj[i].length == 0 && i == "WaitTypelist") {
                let typeArr = [];
                for (let j = 0; j < chooseTypeArr.length; j++) {
                    typeArr.push(j + 1);
                }
                wrapObj[i] = typeArr;
            }else{
                wrapObj[i] = obj[i];
            }
        }
        return wrapObj;
    }
    return obj;
}
function isArray(o) {
    return Object.prototype.toString.call(o).slice(8, -1);
}

class HaveDoEvent extends React.PureComponent {
    constructor(props) {
        super(props);

        this.STATE_NAME = "state_broker_have_done";
        this.handleSelectedPage = this.handleSelectedPage.bind(this);
        this.handleChangeData = this.handleChangeData.bind(this);
        this.handleClickSummit = this.handleClickSummit.bind(this);
        this.resetData = this.resetData.bind(this);
        this.chooseType = this.chooseType.bind(this);
        this.clickRefresh = this.clickRefresh.bind(this);
    }
    componentWillMount() {
        chooseTypeArr = this.props.chooseTypes;
        initParams = Object.assign({}, this.props.QueryParams);
        getHaveDoneData(filterObject(this.props.QueryParams));
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
    goBacks() {
        browserHistory.goBack();
    }

    handleSelectedPage(page) {
        let dataSize = this.props.pageSize;
        let QueryParams = this.props.QueryParams;
        setParams(this.STATE_NAME, {
            currentPage: page,
            QueryParams: Object.assign({}, this.props.QueryParams, {RecordIndex: (page - 1) * dataSize})
        });
        QueryParams.RecordIndex = (page - 1) * dataSize;
        getHaveDoneData(filterObject(QueryParams));
    }

    handleChangeData(e) {
        
        
        
        if(e.target.name == "EndTime" && this.props.QueryParams.StarTime > e.target.value) {
            alert("结束时间不能小于开始时间, 请重新设置！");
        }
        setParams(this.STATE_NAME, {QueryParams: Object.assign({}, this.props.QueryParams, {[e.target.name]: e.target.value})});
    }
    handleClickSummit() {
        let QueryParams = this.props.QueryParams;
        if(QueryParams.Phone.length != 11 && QueryParams.Phone != "") {
            alert("电话号码输入错误!");
            return;
        }
        if(QueryParams.EndTime < QueryParams.StarTime) {
            alert("结束时间不能小于开始时间, 请重新设置！");
            return;
        }
        QueryParams.RecordIndex = 0;
        setParams(this.STATE_NAME, {
            currentPage: 1
        });
        getHaveDoneData(filterObject(QueryParams));
    }

    chooseType(e) {
        let ChooseArr = this.props.chooseTypes;
        let TypeArr = this.props.QueryParams.WaitTypelist;
        if(e.target.checked && e.target.value) {
            let val = Number(e.target.value);
            TypeArr.push(val);
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
            let chooseAllState = this.props.chooseAll;
            if(chooseAllState) {
                for(let i = 0;i < ChooseArr.length;i++) {
                    ChooseArr[i].chooseType = true;
                }
                setParams(this.STATE_NAME, {
                    chooseTypes: ChooseArr,
                    chooseAll: false
                });
            }else{
                for(let i = 0;i < ChooseArr.length;i++) {
                    ChooseArr[i].chooseType = false;
                }
                setParams(this.STATE_NAME, {
                    chooseTypes: ChooseArr,
                    chooseAll: true
                });
            }
            if(chooseAllState) {
                TypeArr = this.props.chooseTypes.map((item, index)=>{
                    return (index + 1);
                });
            }else{
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

        setParams(this.STATE_NAME, {QueryParams: Object.assign({}, this.props.QueryParams, {WaitTypelist: TypeArr})});
    }
    clickRefresh() { // 刷新数据
        getHaveDoneData(filterObject(this.props.QueryParams));
        resetState(this.STATE_NAME);
    }
    resetData() {
        resetUserInforList(this.STATE_NAME);
    }
    render() {

        let RecordDone = this.props.RecordDone ? this.props.RecordDone : [];

        return (
            <div className="have-done">
                <PageTitle title="已办记录" callRefresh = {this.clickRefresh}></PageTitle>
                <div className="btn event-btn" onClick={this.goBacks}>返回</div>
                <div className="container-fluid search-reset bg-white" style={{margin: "0"}}>
                    <div className="row">
                        <div className="col-md-1">
                            <label className="col-form-label text-right">办理日期</label>
                        </div>
                        <div className="col-md-3">
                            <input type="date" name="StarTime" value={this.props.QueryParams.StarTime} onChange={this.handleChangeData} className="form-control search-date"/>
                        </div>
                        <div className="col-md-1">
                        </div>
                        <div className="col-md-3" style={{position: "relative", left: "-8%"}}>
                            <input type="date" name="EndTime" value={this.props.QueryParams.EndTime} onChange={this.handleChangeData} className="form-control search-date"/>
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
                            <input type="text" name="Phone" onChange={this.handleChangeData} value={this.props.QueryParams.Phone} className="form-control" placeholder="请输入会员电话"/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-1">
                            <label className="col-form-label text-right">已办记录</label>
                        </div>
                        <div className="col-md-11 need-do-type">
                            <span><input type="checkbox" onClick={this.chooseType} value="" style={{position: "relative", top: "1px", marginRight: "2px"}} checked={!this.props.chooseAll}/> 全选</span>&emsp;&emsp;
                            { this.props.chooseTypes.map((item, index)=>{
                                return(
                                    <span style={{marginRight: "10px"}} key={index}><input type="checkbox" checked={item.chooseType} onClick={this.chooseType} style={{position: "relative", top: "1px", marginRight: "2px"}} value={index + 1}/>{item.name}</span>
                                );
                            })}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-7"></div>
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
                        <table className="table table-bordered" style={{marginBottom: 0}}>
                            <thead>
                            <tr>
                                <th>时间</th>
                                <th>会员姓名</th>
                                <th>已办类型</th>
                                <th>待办说明</th>
                                <th>办理内容</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                RecordDone.map((item, index)=>{
                                    return(
                                        <tr onClick={()=>this.handleClickUser(item.UserID, item.Name)} key={index}>
                                            <td>{item.Retime}</td>
                                            <td>{item.Name}</td>
                                            <td>{
                                                stateObjs.ReType[item.ReType]
                                            }</td>
                                            <td>{item.ReContent}</td>
                                            <td>{item.ReCallRecord}</td>
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

export default HaveDoEvent;