import React from 'react';
import PageTitle from "COMPONENT/PageTitle";
import getNeedToDoData from 'ACTION/Broker/NeedToDo/NeedToDoData';
import {browserHistory} from 'react-router';
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

class NeedDoEvent extends React.PureComponent {
    constructor(props) {
        super(props);

        this.STATE_NAME = "state_need_to_do_data";
        this.handleChangeData = this.handleChangeData.bind(this);
        this.handleClickSummit = this.handleClickSummit.bind(this);
        this.chooseType = this.chooseType.bind(this);
        this.clickRefresh = this.clickRefresh.bind(this);
        this.resetData = this.resetData.bind(this);
    }
    componentWillMount() {
        chooseTypeArr = this.props.chooseTypes;
        initParams = Object.assign({}, this.props.QueryParams);
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
    handleClickNeedDoEvent() {
        browserHistory.push({
            pathname: "/broker/have-done"
        });
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

    handleChangeData(e) {
        setParams(this.STATE_NAME, {QueryParams: Object.assign(this.props.QueryParams, {[e.target.name]: e.target.value})});
    }
    handleClickSummit() {
        // getNeedToDoData(filterObject(this.props.QueryParams));
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
        // getNeedToDoData(filterObject(this.props.QueryParams));
        resetState(this.STATE_NAME);
    }
    resetData() {
        resetUserInforList(this.STATE_NAME);
    }
    render() {
        let tableData = this.props.WaitList ? this.props.WaitList : [];
        return (
           <div className="need-do">
               <PageTitle title="待办事项" callRefresh = {this.clickRefresh}></PageTitle>
               <button className="btn btn-info event-btn" onClick={this.handleClickNeedDoEvent}>已办记录</button>
               <div className="container-fluid search-reset bg-white" style={{margin: "0"}}>
                   <div className="row">
                       <div className="col-md-1">
                           <label className="col-form-label text-right">待办类型</label>
                       </div>
                       <div className="col-md-11 need-do-type">
                           <span><input type="checkbox" onClick={this.chooseType} style={{position: "relative", top: "1px", marginRight: "2px"}} value="" checked={!this.props.chooseAll}/> 全选</span>&emsp;&emsp;
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
                       <table className="table table-bordered">
                           <thead>
                           <tr>
                               <th>生成时间</th>
                               <th>会员姓名</th>
                               <th>待办类型</th>
                           </tr>
                           </thead>
                           <tbody>
                           {
                               tableData.map((item, index)=>{
                                   return(
                                       <tr key={index} onClick={()=>this.handleClickUser(item.UserID, item.NickName)}>
                                           <td width="20%">{item.CreateTime}</td>
                                           <td width="20%">{item.RealName || item.CallName || item.NickName}</td>
                                           <td width="60%">{
                                               item.WaitTypelist.map((item1, index1)=>{
                                                   return(
                                                       <span className="need-do-type-span btn-info" key={index1}>{stateObjs.ReType[item1]}</span>
                                                   );
                                               })
                                           }
                                           </td>
                                       </tr>
                                   );
                               })}
                           </tbody>
                       </table>
                   </div>

               </div>
           </div>
        );
    }
}

export default NeedDoEvent;