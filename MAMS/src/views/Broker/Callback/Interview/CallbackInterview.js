import React from 'react';
import 'SCSS/pages/broker/callback-interview-view.scss';
import Pagination from 'COMPONENT/Pagination';
import SelectableInput from 'COMPONENT/SelectableInput/index';
import setParams from 'ACTION/setParams';
import resetQueryParams from 'ACTION/resetQueryParams';
import openDialog from 'ACTION/Dialog/openDialog';
import moment from 'moment';
import {DatePicker} from 'antd';
import {browserHistory} from 'react-router';
// 业务相关
import getCallBackInterviewList from 'ACTION/Broker/CallbackInterview/getCallbackInterviewList';
import updateInterviewReply from 'ACTION/Broker/CallbackInterview/updateInterviewReply';
import setInterviewReply from 'ACTION/Broker/CallbackInterview/setInterviewReply';
import EnumInterview from 'CONFIG/EnumerateLib/Mapping_Interview';
import EnumUser from 'CONFIG/EnumerateLib/Mapping_User';
import getRecruitNameList from 'ACTION/Broker/Recruit/getRecruitNameList';

// 旧UI 废弃
export default class CallbackInterview extends React.PureComponent {
    constructor(props) {
        super(props);
        this.STATE_NAME = 'state_broker_callbackInterview';
        this.eResult = Object.assign({}, EnumInterview.eResult);
        this.eResultList = Object.keys(this.eResult).map((v) => v - 0);
        this.eResultComplex = Object.assign({}, EnumInterview.eResultComplex);
        this.eResultComplexList = Object.keys(this.eResultComplex).map((v) => v - 0);
        // this.eResult[0] = '请选择';
        this.eCallbackStatus = Object.assign({}, EnumInterview.eCallbackStatus);
        this.eCallbackStatusList = Object.keys(this.eCallbackStatus).map((v) => v - 0);

    }

    componentWillMount() {
        if (this.props.location.lastKey !== this.props.location.key && !(this.props.location.state && this.props.location.state.clickTab)) {
            this.init();
        }
    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {
        if (this.props.interview.currentPage !== nextProps.interview.currentPage) {
            this.doQuery(nextProps.interview);
        }
    }

    componentWillUpdate(nextProps, nextState) {

    }

    componentDidUpdate() {
        let nowData = this.props.interview;
        if (nowData.setInterviewReplyFetch.status == 'success') {
            // let updateUserId = nowData.setInterviewReplyFetch.params.UserOrderID;
            // let index = nowData.interviewList.findIndex((item) => item.UserOrderID == updateUserId);
            // this.changeTmpReply(index, '');
            setParams(this.STATE_NAME, {setInterviewReplyFetch: {status: 'close'}});
            openDialog({
                id: 'setInterviewReplySuccess',
                type: 'toast',
                message: '联系记录已添加'
            });
            this.doQuery(nowData);
        }
    }

    componentWillUnmount() {
    }

    init(reload) {
        if (reload || this.props.recruitList.recruitNameList.length == 0) {
            getRecruitNameList();
        }
        // let queryParams = this.props.interview.queryParams;
        // queryParams.InterviewStatus = this.eResultList;
        this.doQuery(this.props.interview);
    }

    handleRefresh() {
        this.init(true);
    }

    doQuery(data, reload = false) {
        let queryData = Object.assign({}, data.queryParams);
        if (queryData.CallbackStatus === 0) queryData.CallbackStatus = null;
        if (queryData.StartDate) queryData.StartDate = queryData.StartDate.format('YYYY-MM-DD');
        else queryData.StartDate = '';
        if (queryData.StopDate) queryData.StopDate = queryData.StopDate.format('YYYY-MM-DD');
        else queryData.StopDate = '';
        // 原结果状态映射
        // if (queryData.InterviewStatus.length == this.eResultList.length) queryData.InterviewStatus = [];
        // else queryData.InterviewStatus = queryData.InterviewStatus.join(',');
        // 双字段结果状态映射
        if (queryData.InterviewStatus.length == this.eResultComplexList.length) {
            queryData.InterviewStatus = [];
            queryData.LaborListStatus = [];
        }
        else if (queryData.InterviewStatus.length > 0) {
            let ivStatus = [];
            let llStatus = [];
            for (let key of queryData.InterviewStatus) {

                let item = this.eResultComplex[key];
                ivStatus.push(item.InterviewStatus);
                llStatus.push(item.LaborListStatus);
            }
            queryData.InterviewStatus = Array.from(new Set(ivStatus));
            queryData.LaborListStatus = Array.from(new Set(llStatus));
        }
        else {
            queryData.InterviewStatus = [];
            queryData.LaborListStatus = [];
        }
        queryData.InterviewStatus = queryData.InterviewStatus.join(',');
        queryData.LaborListStatus = queryData.LaborListStatus.join(',');
        // 点击查询按钮时，重置分页数据的逻辑
        let RecordIndex = data.pageSize * (data.currentPage - 1);
        if (reload) {
            RecordIndex = 0;
            setParams(this.STATE_NAME, {currentPage: 1});
            if (data.currentPage !== 1) return;
        }
        getCallBackInterviewList({
            OrderParams: data.orderParams,
            QueryParams: queryData,
            RecordIndex: RecordIndex,
            RecordSize: data.pageSize
        });
        // 清空缓存的联系记录
        setParams(this.STATE_NAME, {tmpReplyObj: {}});
    }

    resetQuery() {
        resetQueryParams(this.STATE_NAME);
    }

    handleSelectedPage(page) {
        setParams(this.STATE_NAME, {
            currentPage: page
        });
    }

    handleSetParam(key, value, paramName = 'queryParams') {
        let data = this.props.interview;
        setParams(this.STATE_NAME, {[paramName]: Object.assign({}, data[paramName], {[key]: value})});
    }

    handleSetMultiSelectParam(key, value, paramName = 'queryParams') {
        let data = this.props.interview;
        let valArr = [].concat(data[paramName][key]);
        if (Object.prototype.toString.call(value) === '[object Array]') {
            if (value.length != valArr.length) valArr = [].concat(value);
            else valArr = [];
        }
        else {
            const valIndex = valArr.indexOf(value);
            if (valIndex == -1) {
                valArr = [value, ...valArr];
            } else {
                valArr.splice(valIndex, 1);
            }
        }
        this.handleSetParam(key, valArr, paramName);
    }

    handleChangeTmpReply(index, e) {
        this.changeTmpReply(index, e.target.value);
    }

    changeTmpReply(index, val) {
        let replyObj = Object.assign({}, this.props.interview.tmpReplyObj, {[index]: val});
        updateInterviewReply(replyObj);
    }

    handleClickSetReply(item, index, e) {
        let replyStr = this.props.interview.tmpReplyObj[index];
        if (replyStr == '' || replyStr == undefined || replyStr == null) return;
        if (replyStr.length < 5) {
            openDialog({
                id: 'replyStrTooShort',
                type: 'alert',
                theme: 'warning',
                title: '添加联系记录失败',
                message: '联系记录不得少于五个字'
            });
            return;
        }
        setInterviewReply({
            CallBackContent: replyStr,
            CallType: 11,
            UserId: item.UserID,
            UserStatus: item.UserStatus,
            UserOrderID: item.UserOrderID
        });
    }

    mapInterviewStatusText(item) {
        let targetKey = Object.keys(this.eResultComplex).find((key) => {
            let resItem = this.eResultComplex[key];
            return resItem.LaborListStatus == item.LaborListStatus && resItem.InterviewStatus == item.InterviewStatus;
        });
        if (targetKey) return this.eResultComplex[targetKey].value;
        return '';
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

    render() {
        let pageData = this.props.interview;
        let queryParams = this.props.interview.queryParams;
        return (
            <div className='callback-interview-view'>
                <div className="ivy-page-title">
                    <h1 className="title-text">确认面试回访</h1>
                    <span className="refresh-icon float-right" onClick={() => this.handleRefresh()}>
                        <i className="iconfont icon-shuaxin"></i>
                    </span>
                </div>
                <div className='page-body'>
                    <form className='content-chunk search-from mt-4'>
                        <div className="form-group row">
                            <label className='col-1 col-form-label'>签到日期</label>
                            <div className="col-2">
                                {/* <input type="text" className="form-control" value={queryParams.StartDate}*/}
                                {/* onChange={(e) => this.handleSetParam('StartDate', e.target.value)}*/}
                                {/* placeholder="开始日期"/>*/}
                                <DatePicker className="form-control" placeholder="开始日期"
                                            value={queryParams.StartDate} format='YYYY-MM-DD'
                                            onChange={(date) => this.handleSetParam('StartDate', date)}/>
                            </div>
                            <div className="col-1 col-form-label">——</div>
                            <div className="col-2">
                                {/* <input type="text" className="form-control" value={queryParams.StopDate}*/}
                                {/* onChange={(e) => this.handleSetParam('StopDate', e.target.value)}*/}
                                {/* placeholder=""/>*/}
                                <DatePicker className="form-control" placeholder="截止日期"
                                            value={queryParams.StopDate} format='YYYY-MM-DD'
                                            onChange={(date) => this.handleSetParam('StopDate', date)}/>
                            </div>
                            <label className='col-1 col-form-label'>会员姓名</label>
                            <div className="col-2">
                                <input type="text" className="form-control" value={queryParams.UserName || ''}
                                       onChange={(e) => this.handleSetParam('UserName', e.target.value)}
                                       placeholder="请输入姓名"/>
                            </div>
                            <label className='col-1 col-form-label'>会员电话</label>
                            <div className="col-2">
                                <input type="text" className="form-control" value={queryParams.UserMobile || ''}
                                       onChange={(e) => this.handleSetParam('UserMobile', e.target.value)}
                                       placeholder='请输入电话'/>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className='col-1 col-form-label'>企业</label>
                            <SelectableInput
                                onSelecteData={(id) => this.handleSetParam('CheckinRecruitID', id)}
                                onChangeData={(val) => this.handleSetParam('RecruitTmp', val, 'otherParams')}
                                dataArr={this.props.recruitList.recruitNameList}
                                iptValue={pageData.otherParams.RecruitTmp}
                                iptID={queryParams.CheckinRecruitID}
                                iptOptions={{
                                    placeholder: '请输入企业',
                                    keyParam: 'RecruitID',
                                    valParam: 'RecruitName'
                                }}></SelectableInput>
                            <label className='col-1 col-form-label'>是否联系</label>
                            <div className="col-2">
                                <select className='form-control' value={queryParams.CallbackStatus}
                                        onChange={(e) => this.handleSetParam('CallbackStatus', e.target.value - 0)}>
                                    <option value="0">请选择</option>
                                    {this.eCallbackStatusList.map((key, index) => (
                                        <option key={index} value={key}>{this.eCallbackStatus[key]}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className='col-1 col-form-label'>面试结果</label>
                            <div className="col-11">
                                <div className="form-check form-check-inline">
                                    <label className="form-check-label mr-3">
                                        <input className="form-check-input" type="checkbox" readOnly
                                               checked={queryParams.InterviewStatus.length == this.eResultComplexList.length}
                                               onClick={(e) => this.handleSetMultiSelectParam('InterviewStatus', this.eResultComplexList)}/>
                                        全选
                                    </label>
                                    {this.eResultComplexList.map((key, index) => {
                                        return (
                                            <label key={index} className="form-check-label mr-3">
                                                <input className="form-check-input" type="checkbox" readOnly
                                                       checked={queryParams.InterviewStatus.indexOf(key) > -1}
                                                       onClick={(e) => this.handleSetMultiSelectParam('InterviewStatus', key)}/>
                                                {this.eResultComplex[key].value}
                                            </label>);
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className='col-4 offset-4 text-center'>
                                <div className="row">
                                    <div className="col-6">
                                        <button type="button" onClick={() => this.resetQuery()}
                                                className="btn btn-warning btn-block">重置
                                        </button>
                                    </div>
                                    <div className="col-6">
                                        <button type="button" onClick={() => this.doQuery(pageData, true)}
                                                className="btn btn-info btn-block">查询
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                    <div className='content-chunk mt-4' style={{minHeight: '280px'}}>
                        <table className='table table-sm table-bordered'>
                            <thead>
                            <tr>
                                <th>序号</th>
                                <th>签到日期</th>
                                <th>会员名称</th>
                                <th>面试企业</th>
                                <th>面试结果</th>
                                <th>最近联系记录</th>
                                <th>填写联系记录</th>
                                <th>是否联系</th>
                            </tr>
                            </thead>
                            <tbody>
                            {pageData.interviewList.map((item, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item.Checkin ? moment(item.Checkin).format('YYYY/MM/DD') : ''}</td>
                                    <td className="color-primary"
                                        onClick={() => this.handleClickUser(item.UserID, item.UserName)}>{item.UserName}</td>
                                    <td>{item.CheckinRecruitName}</td>
                                    <td>
                                        {this.mapInterviewStatusText(item)}
                                    </td>
                                    <td>{item.CallbackContent}</td>
                                    <td>
                                        <div className="input-group">
                                             <span className="input-group-addon">
                                                 <i className="iconfont icon-dianhua color-primary"></i>
                                             </span>
                                            <input type='text' placeholder="填写联系记录" className="form-control"
                                                   value={pageData.tmpReplyObj[index] || ''}
                                                   onChange={this.handleChangeTmpReply.bind(this, index)}/>
                                            <span className="input-group-btn">
                                                <button className="btn btn-primary btn-sm"
                                                        onClick={this.handleClickSetReply.bind(this, item, index)}>保存</button>
                                            </span>
                                        </div>
                                    </td>
                                    <td>{this.eCallbackStatus[item.CallbackStatus]}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        <div className="row bg-white">
                            <div className="container-fluid">
                                <Pagination totalSize={pageData.totalSize} pageSize={pageData.pageSize}
                                            afterSelectedPage={this.handleSelectedPage.bind(this)}
                                            initPage={pageData.currentPage}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}