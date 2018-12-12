import React from 'react';
import 'SCSS/pages/broker/remind-history-view.scss';
import 'UTIL/base/DataProcess/dateUtil';
import {browserHistory} from 'react-router';
import setParams from 'ACTION/setParams';
import resetQueryParams from 'ACTION/resetQueryParams';
import Pagination from 'COMPONENT/Pagination';
import openDialog from 'ACTION/Dialog/openDialog';
import moment from 'moment';
import {DatePicker} from 'antd';
// 业务相关
import EnumUserRemind from 'CONFIG/EnumerateLib/Mapping_UserRemind';
import getRemindHistoryList from 'ACTION/Broker/Remind/getRemindHistoryList';
import setRemindDeleted from 'ACTION/Broker/Remind/setRemindDeleted';

export default class RemindHistory extends React.PureComponent {
    constructor(props) {
        super(props);
        this.STATE_NAME = 'state_broker_remindHistory';
        this.PAGE_STATE_NAME = 'state_broker_remindUnRead';
        this.eType = Object.assign({}, EnumUserRemind.eType);
        this.eTypeList = Object.keys(this.eType).map((v) => v - 0);
        this.remindList = this.filterByTime(props.remindHistory.remindHistoryList);
    }

    componentWillMount() {
        if (this.props.location.lastKey !== this.props.location.key && !(this.props.location.state && this.props.location.state.clickTab)) {
            this.init();
        }
    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {
        let nowPageData = this.props.remindUnread;
        let nextPageData = nextProps.remindUnread;
        if ((nextPageData.needRefresh == true || nowPageData.showTag != nextPageData.showTag) && nextPageData.showTag == 'history') {
            this.handleCallRefresh();
            setParams(this.PAGE_STATE_NAME, {needRefresh: false});
        }
        if (this.props.remindHistory.currentPage !== nextProps.remindHistory.currentPage) {
            this.doQuery(nextProps.remindHistory);
        }
    }

    componentWillUpdate(nextProps, nextState) {
        // 判断删除提醒请求成功，并执行查询刷新
        let data = nextProps.remindHistory;
        if (data.setRemindDeletedFetch.status == 'success') {
            openDialog({
                id: 'setRemindDeleteedSuccess',
                type: 'toast',
                message: '删除提醒成功'
            });
            setParams(this.STATE_NAME, {setRemindDeletedFetch: {status: 'close'}});
            this.doQuery(data);
        }
        // 判断更新了未读消息列表
        let nextListFetch = nextProps.remindHistory.getRemindHistoryFetch;
        let currentListFetch = this.props.remindHistory.getRemindHistoryFetch;
        if (nextListFetch.status == 'success' && currentListFetch.status != nextListFetch.status) {
            this.remindList = this.filterByTime(nextProps.remindHistory.remindHistoryList);
        }
    }

    componentDidUpdate() {

    }

    componentWillUnmount() {

    }

    init() {
        let data = this.props.remindHistory;
        let queryParams = data.queryParams;
        queryParams.Newstype = this.eTypeList;
        this.doQuery(data);
    }

    filterByTime(targetList) {
        
        let list = targetList.map((item) => Object.assign({}, item));
        if ((list || []).length == 0) return [];
        let remindObj = {};
        for (let item of list) {
            item.NewsTimeObj = new Date(item.NewsTime.replace('/\-/g', '/'));
            let dateStr = this.showDate(item.NewsTimeObj);
            if (remindObj[dateStr] != undefined && remindObj[dateStr] != null) {
                remindObj[dateStr].arr.push(item);
            } else {
                remindObj[dateStr] = {dateStr: dateStr, arr: [item]};
            }
        }
        remindObj = Object.keys(remindObj).map((key) => remindObj[key]);
        
        return remindObj;
    }


    handleCallRefresh() {
        this.init();
    }

    showDate(date) {
        let now = new Date();
        const dayDiff = now.DateDiff('d', date);
        if (dayDiff == 0) {
            return '今天';
        } else if (dayDiff == -1) {
            return '昨天';
        } else {
            return date.Format('MM/dd');
        }
    }

    handleGoPage(path) {
        browserHistory.push({
            pathname: path
        });
    }

    doQuery(data, reload = false) {
        let queryData = data.queryParams;
        if (queryData.Newstype.length == this.eTypeList.length) queryData.Newstype = [];
        // 点击查询按钮时，重置分页数据的逻辑
        let RecordIndex = data.pageSize * (data.currentPage - 1);
        if (reload) {
            RecordIndex = 0;
            setParams(this.STATE_NAME, {currentPage: 1});
            if (data.currentPage !== 1) return;
        }
        let requestData = {
            Newstype: queryData.Newstype,
            ReadTypr: 2,
            QueryParams: [],
            OrderParams: data.orderParams,
            // QueryParams: queryData,
            RecordIndex: RecordIndex,
            RecordSize: data.pageSize
        };
        // 日期临时处理
        if (queryData.ReStarTime) requestData.ReStarTime = queryData.ReStarTime.format('YYYY-MM-DD');
        if (queryData.ReEndTime) requestData.ReEndTime = queryData.ReEndTime.format('YYYY-MM-DD');
        if ((queryData.MemberName || '').length > 0) requestData.MemberName = queryData.MemberName;
        getRemindHistoryList(requestData);
    }

    resetQuery() {
        resetQueryParams(this.STATE_NAME);
    }

    handleSelectedPage(page) {
        setParams(this.STATE_NAME, {
            currentPage: page
        });
    }

    handleSetParam(key, value) {
        let queryParams = this.props.remindHistory.queryParams;
        setParams(this.STATE_NAME, {queryParams: Object.assign({}, queryParams, {[key]: value})});
    }

    handleSetMultiSelectParam(key, value, paramName = 'queryParams') {
        let data = this.props.remindHistory;
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

    handleDoDelete() {
        let RemindID = this.props.remindHistory.DelRemindID;
        if (RemindID.length > 0) {
            // Status: 0设为删除
            setRemindDeleted({Status: 0, RemindID: RemindID});
        }
    }

    handlePickDelete(type, data) {
        let PickedDelRemindID = [].concat(this.props.remindHistory.DelRemindID);
        let DelRemindID = [];
        // 
        if (type == 'all') {
            let list = this.props.remindHistory.remindHistoryList.map((item) => item.NewID);
            if (PickedDelRemindID.length >= list.length) {
                DelRemindID = [];
            } else {
                DelRemindID = list;
            }
        } else if (type == 'single') {
            
            if (PickedDelRemindID.indexOf(data.NewID) > -1) {
                
                DelRemindID = PickedDelRemindID.filter((item) => item != data.NewID);
            } else {
                PickedDelRemindID.push(data.NewID);
                DelRemindID = PickedDelRemindID;
                
            }
        }
        DelRemindID = Array.from(new Set(DelRemindID));
        setParams(this.STATE_NAME, {DelRemindID: DelRemindID});
    }

    handleClickUser(id, name) {
        browserHistory.push({
            pathname: '/broker/member/detail/' + id,
            query: {
                memberName: name
            }
        });
    }

    render() {
        let rmData = this.props.remindUnread;
        let pageData = this.props.remindHistory;
        let queryParams = pageData.queryParams;
        let memberNum = new Set(this.remindList.map((v) => v.MemberId)).size;
        if (rmData.showTag != 'history') {
            return (<div style={{display: 'none'}}></div>);
        }
        return (
            <div className='remind-history-view'>
                <form className='content-chunk search-from'>
                    <div className="form-group row">
                        <label className='col-2 col-form-label'>会员姓名</label>
                        <div className="col-3">
                            <input type="text" className="form-control" value={queryParams.MemberName}
                                   onChange={(e) => this.handleSetParam('MemberName', e.target.value)}
                                   placeholder="请输入名称"/>
                        </div>
                        <label className='col-2 col-form-label'>提醒日期</label>
                        <div className="col-2">
                            <DatePicker className="form-control" placeholder="开始日期"
                                        value={queryParams.ReStarTime} format='YYYY-MM-DD'
                                        onChange={(date) => this.handleSetParam('ReStarTime', date)}/>
                        </div>
                        <div className="col-1 col-form-label">——</div>
                        <div className="col-2">
                            <DatePicker className="form-control" placeholder="结束日期"
                                        value={queryParams.ReEndTime} format='YYYY-MM-DD'
                                        onChange={(date) => this.handleSetParam('ReEndTime', date)}/>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className='col-2 col-form-label'>提醒类型</label>
                        <div className="col-10">
                            <div className="form-check form-check-inline">
                                <label className="form-check-label mr-3">
                                    <input className="form-check-input" type="checkbox" readOnly
                                           checked={queryParams.Newstype.length == this.eTypeList.length}
                                           onClick={(e) => this.handleSetMultiSelectParam('Newstype', this.eTypeList)}/>
                                    全选
                                </label>
                                {this.eTypeList.map((key, index) => {
                                    return (
                                        <label key={index} className="form-check-label mr-3">
                                            <input className="form-check-input" type="checkbox" readOnly
                                                   checked={queryParams.Newstype.indexOf(key) > -1}
                                                   onClick={(e) => this.handleSetMultiSelectParam('Newstype', key)}/>
                                            {this.eType[key]}
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
                    <table className='remind-table table table-sm table-bordered'>
                        <thead>
                        <tr style={pageData.remindHistoryList.length > 0 ? {} : {display: 'none'}}>
                            <td colSpan={4}>
                                <button type='button' onClick={() => this.handleDoDelete()}
                                        disabled={pageData.DelRemindID.length == 0}
                                        className="btn btn-sm btn-outline-primary ml-4 mt-2 mb-2">删除
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <td className="text-left pl-3" style={{width: '20%'}}>
                                <label className="custom-control custom-checkbox remind-checkbox mr-4"
                                       style={pageData.remindHistoryList.length > 0 ? {} : {display: 'none'}}>
                                    <input type='checkbox' className='custom-control-input' readOnly
                                           checked={pageData.DelRemindID.length >= pageData.remindHistoryList.length}
                                           onClick={() => this.handlePickDelete('all')}/>
                                    <span className="custom-control-indicator"></span>
                                </label>
                                会员姓名
                            </td>
                            <td className="text-center" style={{width: '15%'}}>提醒类型</td>
                            <td className="text-left pl-3" style={{width: '50%'}}>内容</td>
                            <td className="text-left pl-3" style={{width: '15%'}}>时间</td>
                        </tr>
                        </thead>
                        <tbody>

                        {this.remindList.reduce((arr, dateRemind, index) => {
                            arr.push(
                                <tr key={index} height='40px'>
                                    <td className="text-left pl-4"
                                        colSpan={4}>{`${dateRemind.dateStr}(${dateRemind.arr.length})`}</td>
                                </tr>);
                            dateRemind.arr.map((item, j) => arr.push((
                                <tr key={(index + 1) * 1000 + j} height='40px'>
                                    <td className="text-left pl-3">
                                        <label className="custom-control custom-checkbox remind-checkbox mr-4">
                                            <input type='checkbox' className='custom-control-input' readOnly
                                                   checked={pageData.DelRemindID.indexOf(item.NewID) > -1}
                                                   onClick={() => this.handlePickDelete('single', item)}/>
                                            <span className="custom-control-indicator"></span>
                                        </label>
                                        <span onClick={() => this.handleClickUser(item.MemberID, item.Name)}>
                                            {item.Name}</span>
                                    </td>
                                    <td className="text-center">{this.eType[item.NewsType]}</td>
                                    <td className="text-left pl-3">{item.Content}</td>
                                    <td className="text-left pl-3">{item.NewsTimeObj.Format('hh:mm')}</td>
                                </tr>
                            )));
                            return arr;
                        }, [])}
                        </tbody>
                    </table>
                    <div className="row bg-white"
                         style={pageData.remindHistoryList.length > 0 ? {} : {display: 'none'}}>
                        <div className="container-fluid">
                            <Pagination totalSize={pageData.totalSize} pageSize={pageData.pageSize}
                                        afterSelectedPage={this.handleSelectedPage.bind(this)}
                                        initPage={pageData.currentPage}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}