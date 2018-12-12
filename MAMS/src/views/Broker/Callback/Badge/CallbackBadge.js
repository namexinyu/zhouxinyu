import React from 'react';
import 'SCSS/pages/broker/callback-badge-view.scss';
import Pagination from 'COMPONENT/Pagination';
import SelectableInput from 'COMPONENT/SelectableInput/index';
import setParams from 'ACTION/setParams';
import resetQueryParams from 'ACTION/resetQueryParams';
import openDialog from 'ACTION/Dialog/openDialog';
import {browserHistory} from 'react-router';
import moment from 'moment';
import {DatePicker} from 'antd';
// 业务相关
import EnumInterview from 'CONFIG/EnumerateLib/Mapping_Interview';
import getCallBackBadgeList from 'ACTION/Broker/CallbackBadge/getCallbackBadgeList';
import getRecruitNameList from 'ACTION/Broker/Recruit/getRecruitNameList';

// 旧UI 废弃
export default class CallbackBadge extends React.PureComponent {
    constructor(props) {
        super(props);
        this.STATE_NAME = 'state_broker_callbackBadge';
        this.eBadgeStatus = Object.assign({}, EnumInterview.eBadgeStatus);
        // this.eBadgeStatus[0] = '请选择';
        this.eBadgeStatusList = Object.keys(this.eBadgeStatus).map((v) => v - 0);
        this.eResultComplex = Object.assign({}, EnumInterview.eResultComplex);
        this.eResultComplexList = Object.keys(this.eResultComplex).map((v) => v - 0);
    }

    componentWillMount() {
        if (this.props.location.lastKey !== this.props.location.key && !(this.props.location.state && this.props.location.state.clickTab)) {
            this.init();
        }
    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {
        if (this.props.badge.currentPage !== nextProps.badge.currentPage) {
            this.doQuery(nextProps.badge);
        }
    }

    componentWillUpdate(nextProps, nextState) {

    }

    componentDidUpdate() {

    }

    componentWillUnmount() {

    }

    init() {
        getRecruitNameList();
        let data = this.props.badge;
        this.doQuery(data);
    }

    handleRefresh() {
        this.init();
    }

    doQuery(data, reload = false) {
        let queryData = Object.assign({}, data.queryParams);
        if (queryData.WorkCardStatus.length == this.eBadgeStatusList.length) queryData.WorkCardStatus = [];
        else queryData.WorkCardStatus = queryData.WorkCardStatus.join(',');
        let RecordIndex = data.pageSize * (data.currentPage - 1);
        if (queryData.StartDate) queryData.StartDate = queryData.StartDate.format('YYYY-MM-DD');
        else queryData.StartDate = '';
        if (queryData.StopDate) queryData.StopDate = queryData.StopDate.format('YYYY-MM-DD');
        else queryData.StopDate = '';
        // 点击查询按钮时，重置分页数据的逻辑
        if (reload) {
            RecordIndex = 0;
            setParams(this.STATE_NAME, {currentPage: 1});
            if (data.currentPage !== 1) return;
        }
        getCallBackBadgeList({
            OrderParams: data.orderParams,
            QueryParams: queryData,
            RecordIndex: RecordIndex,
            RecordSize: data.pageSize
        });
    }

    resetQuery() {
        resetQueryParams(this.STATE_NAME);
    }

    handleSelectedPage(page) {
        setParams(this.STATE_NAME, {
            currentPage: page
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

    handleSetParam(key, value, paramName = 'queryParams') {
        let data = this.props.badge;
        setParams(this.STATE_NAME, {[paramName]: Object.assign({}, data[paramName], {[key]: value})});
    }

    handleSetMultiSelectParam(key, value, paramName = 'queryParams') {
        let data = this.props.badge;
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
        let pageData = this.props.badge;
        let recruitNameList = this.props.recruitList.recruitNameList;
        let queryParams = pageData.queryParams;

        return (
            <div className='callback-badge-view'>
                <div className="ivy-page-title">
                    <h1 className="title-text">入职三天未上传工牌职员</h1>
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
                                       placeholder='请输入姓名'/>
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
                            <label className='col-1 col-form-label'>工牌状态</label>
                            <div className="col-8">
                                <div className="form-check form-check-inline">
                                    <label className="form-check-label mr-3">
                                        <input className="form-check-input" type="checkbox" readOnly
                                               checked={queryParams.WorkCardStatus.length == Object.keys(this.eBadgeStatus).length}
                                               onClick={(e) => this.handleSetMultiSelectParam('WorkCardStatus', this.eBadgeStatusList)}/>
                                        全选
                                    </label>
                                    {this.eBadgeStatusList.map((key, index) => {
                                        return (
                                            <label key={index} className="form-check-label mr-3">
                                                <input className="form-check-input" type="checkbox" readOnly
                                                       checked={queryParams.WorkCardStatus.indexOf(key) > -1}
                                                       onClick={(e) => this.handleSetMultiSelectParam('WorkCardStatus', key)}/>
                                                {this.eBadgeStatus[key]}
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
                                <th>真实名称</th>
                                <th>签到企业</th>
                                <th>面试状态</th>
                                <th>入职天数</th>
                                <th>工牌状态</th>
                                <th>审核备注</th>
                            </tr>
                            </thead>
                            <tbody>
                            {pageData.badgeList.map((item, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item.Checkin ? moment(item.Checkin).format('YYYY/MM/DD') : ''}</td>
                                    <td className="color-primary"
                                        onClick={() => this.handleClickUser(item.UserID, item.UserName)}>{item.UserName}</td>
                                    <td>{item.CheckinRecruitName}</td>
                                    <td>
                                        {this.mapInterviewStatusText(item)}
                                    </td>
                                    <td>{item.EntryDays != undefined && item.EntryDays != null ?
                                        item.EntryDays + '天' : ''}</td>
                                    <td>{this.eBadgeStatus[item.WorkCardStatus] ? this.eBadgeStatus[item.WorkCardStatus] : ''}</td>
                                    <td>{item.vReason}</td>
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