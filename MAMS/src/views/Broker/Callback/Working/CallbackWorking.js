import React from 'react';
import 'SCSS/pages/broker/callback-working-view.scss';
import Pagination from 'COMPONENT/Pagination';
import SelectableInput from 'COMPONENT/SelectableInput/index';
import setParams from 'ACTION/setParams';
import resetQueryParams from 'ACTION/resetQueryParams';
import openDialog from 'ACTION/Dialog/openDialog';
import moment from 'moment';
import {DatePicker} from 'antd';
import {browserHistory} from 'react-router';
// 业务相关
import getCallbackWorkingList from 'ACTION/Broker/CallbackWorking/getCallbackWorkingList';
import updateWorkingReply from 'ACTION/Broker/CallbackWorking/updateWorkingReply';
import setWorkingReply from 'ACTION/Broker/CallbackWorking/setWorkingReply';
import getRecruitNameList from 'ACTION/Broker/Recruit/getRecruitNameList';
import EnumInterview from 'CONFIG/EnumerateLib/Mapping_Interview';

// 旧UI 废弃
export default class CallbackWorking extends React.PureComponent {
    constructor(props) {
        super(props);
        this.STATE_NAME = 'state_broker_callbackWorking';
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
        if (this.props.working.currentPage !== nextProps.working.currentPage) {
            this.doQuery(nextProps.working);
        }
    }

    componentWillUpdate(nextProps, nextState) {

    }

    componentDidUpdate() {
        let nowData = this.props.working;
        if (nowData.setWorkingReplyFetch.status == 'success') {
            // let updateUserId = nowData.setWorkingReplyFetch.params.UserID;
            // let index = nowData.workingList.findIndex((item) => item.UserID == updateUserId);
            // this.changeTmpReply(index, null);
            setParams(this.STATE_NAME, {setWorkingReplyFetch: {status: 'close'}});
            openDialog({
                id: 'setWorkingReplySuccess',
                type: 'toast',
                message: '联系记录已添加'
            });
            this.doQuery(nowData);
        }
    }

    componentWillUnmount() {

    }

    init() {
        getRecruitNameList();
        this.doQuery(this.props.working);
    }

    handleRefresh() {
        this.init();
    }

    doQuery(data, reload = false) {
        let queryData = Object.assign({}, data.queryParams);

        let RecordIndex = data.pageSize * (data.currentPage - 1);
        // 点击查询按钮时，重置分页数据的逻辑
        if (reload) {
            RecordIndex = 0;
            setParams(this.STATE_NAME, {currentPage: 1});
            if (data.currentPage !== 1) return;
        }
        if (queryData.EntryCallbackStatus === 0) queryData.EntryCallbackStatus = null;
        if (queryData.StartDate) queryData.StartDate = queryData.StartDate.format('YYYY-MM-DD');
        else queryData.StartDate = '';
        if (queryData.StopDate) queryData.StopDate = queryData.StopDate.format('YYYY-MM-DD');
        else queryData.StopDate = '';

        getCallbackWorkingList({
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
        let data = this.props.working;
        setParams(this.STATE_NAME, {[paramName]: Object.assign({}, data[paramName], {[key]: value})});
    }

    handleChangeTmpReply(index, e) {
        this.changeTmpReply(index, e.target.value);
    }

    changeTmpReply(index, val) {
        let replyObj = Object.assign({}, this.props.working.tmpReplyObj, {[index]: val});
        updateWorkingReply(replyObj);
    }

    handleClickSetReply(item, index, e) {
        let replyStr = this.props.working.tmpReplyObj[index];
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
        setWorkingReply({
            CallBackContent: replyStr,
            CallType: 12,
            UserId: item.UserID,
            UserStatus: item.UserStatus,
            UserOrderID: item.UserOrderID
        });
    }

    handleClickUser(id, name) {
        if (id) {
            browserHistory.push({
                pathname: '/broker/member/detail/' + id,
                query: {
                    memberName: name
                }
            });
        }
    }

    render() {
        let pageData = this.props.working;
        let queryParams = this.props.working.queryParams;
        return (
            <div className='callback-working-view'>
                <div className="ivy-page-title">
                    <h1 className="title-text">入职一周的会员</h1>
                    <span className="refresh-icon float-right" onClick={() => this.handleRefresh()}>
                        <i className="iconfont icon-shuaxin"></i>
                    </span>
                </div>
                <div className='page-body'>
                    <form className='content-chunk search-from mt-4'>
                        <div className="form-group row">
                            <label className='col-1 col-form-label'>签到日期</label>
                            <div className="col-2">
                                <DatePicker className="form-control" placeholder="开始日期"
                                            value={queryParams.StartDate} format='YYYY-MM-DD'
                                            onChange={(date) => this.handleSetParam('StartDate', date)}/>
                            </div>
                            <div className="col-1 col-form-label">——</div>
                            <div className="col-2">
                                <DatePicker className="form-control" placeholder="截止日期"
                                            value={queryParams.StopDate} format='YYYY-MM-DD'
                                            onChange={(date) => this.handleSetParam('StopDate', date)}/>
                            </div>
                            <label className='col-1 col-form-label'>会员姓名</label>
                            <div className="col-2">
                                <input type="text" className="form-control" value={queryParams.UserName}
                                       onChange={(e) => this.handleSetParam('UserName', e.target.value)}
                                       placeholder="请输入姓名"/>
                            </div>
                            <label className='col-1 col-form-label'>会员电话</label>
                            <div className="col-2">
                                <input type="text" className="form-control" value={queryParams.UserMobile}
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
                                <select className='form-control' value={queryParams.EntryCallbackStatus}
                                        onChange={(e) => this.handleSetParam('EntryCallbackStatus', e.target.value - 0)}>
                                    <option value="0">请选择</option>
                                    {this.eCallbackStatusList.map((key, index) => (
                                        <option key={index} value={key}>{this.eCallbackStatus[key]}</option>
                                    ))}
                                </select>
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
                                <th>入职企业</th>
                                <th>入职天数</th>
                                {/* <th>手机号</th>*/}
                                <th>最近联系记录</th>
                                <th>操作</th>
                                <th>是否已联系</th>
                            </tr>
                            </thead>
                            <tbody>
                            {pageData.workingList.map((item, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item.Checkin ? moment(item.Checkin).format('YYYY/MM/DD') : ''}</td>
                                    <td className="color-primary"
                                        onClick={() => this.handleClickUser(item.UserID, item.UserName)}>{item.UserName}</td>
                                    <td>{item.CheckinRecruitName}</td>
                                    <td>{item.EntryDays != undefined && item.EntryDays != null ?
                                        item.EntryDays + '天' : ''}</td>
                                    {/* <td>{item.InterviewStatus}</td>*/}
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
                                    <td>{this.eCallbackStatus[item.EntryCallbackStatus]}</td>
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