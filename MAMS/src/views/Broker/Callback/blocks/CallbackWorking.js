import React from 'react';
import 'SCSS/pages/broker/callback-working-view.scss';
import {Form, Row, Col, Button, Input, Select, Table, Icon, DatePicker, message, Badge} from 'antd';
import SearchFrom from "COMPONENT/SearchForm/index";
import getAllRecruitData from 'ACTION/Broker/GetAllRecruitListIncludeForbid';
import setParams from 'ACTION/setParams';
import resetQueryParams from 'ACTION/resetQueryParams';
import moment from 'moment';
import {browserHistory} from 'react-router';
// 业务相关
import getCallbackWorkingList from 'ACTION/Broker/CallbackWorking/getCallbackWorkingList';
import updateWorkingReply from 'ACTION/Broker/CallbackWorking/updateWorkingReply';
import setWorkingReply from 'ACTION/Broker/CallbackWorking/setWorkingReply';
import getRecruitNameList from 'ACTION/Broker/Recruit/getRecruitNameList';
import EnumInterview from 'CONFIG/EnumerateLib/Mapping_Interview';
import ActionMAMSRecruitment from 'ACTION/Common/Recruitment/ActionMAMSRecruitment';

// 旧UI 废弃
export default class CallbackWorking extends React.PureComponent {
    constructor(props) {
        super(props);
        this.STATE_NAME = 'state_broker_callbackWorking';
        this.eCallbackStatus = Object.assign({}, EnumInterview.eCallbackStatus);
        this.eCallbackStatusList = Object.keys(this.eCallbackStatus).map((v) => v - 0);
        this.formItems = [
            {name: 'StartDate', label: "开始日期", itemType: 'DatePicker', placeholder: '开始日期'},
            {
                name: 'StopDate', label: "截止日期", allowClear: false,
                itemType: 'DatePicker', placeholder: '截止日期',
                disabledDate: (d) => moment().diff(d, 'days') < 6
            },
            {
                name: 'UserName',
                label: "会员姓名",
                itemType: 'Input',
                placeholder: '请输入姓名'
            },
            {
                name: 'UserMobile',
                label: "会员电话",
                itemType: 'Input',
                placeholder: '请输入电话'
            },
            {
                name: 'CheckinRecruit',
                label: "企业",
                itemType: 'AutoCompleteInput',
                placeholder: '请输入企业',
                valueKey: 'RecruitTmpID',
                textKey: 'RecruitName',
                dataArray: 'recruitFilterList'
            },
            {
                name: 'EntryCallbackStatus',
                label: '是否联系',
                itemType: 'Select',
                type: 'enum',
                enum: this.eCallbackStatus
            }
        ];
    }

    componentWillMount() {
        getAllRecruitData();
        if (this.props.location.lastKey !== this.props.location.key && !(this.props.location.state && this.props.location.state.clickTab)) {
            this.init();
            ActionMAMSRecruitment.GetMAMSRecruitFilterList();
        }
    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {
        if (this.props.list.pageParam !== nextProps.list.pageParam
            || nextProps.list.orderParams !== this.props.list.orderParams) {
            this.doQuery(nextProps.list);
        }
    }

    componentWillUpdate(nextProps, nextState) {
        let nextData = nextProps.list;
        let nowData = this.props.list;
        if (nextData.setWorkingReplyFetch.status == 'success' && nowData.setWorkingReplyFetch.status != 'success') {
            // let updateUserId = nowData.setWorkingReplyFetch.params.UserID;
            // let index = nowData.workingList.findIndex((item) => item.UserID == updateUserId);
            // this.changeTmpReply(index, null);
            setParams(this.STATE_NAME, {setWorkingReplyFetch: {status: 'close'}});
            message.info('联系记录已添加');
            this.doQuery(nowData);
        } else if (nextData.setWorkingReplyFetch.status == 'error' && nowData.setWorkingReplyFetch.status != 'error') {
            setParams(this.STATE_NAME, {setWorkingReplyFetch: {status: 'close'}});
            message.info('联系记录添加失败');
        }
    }

    componentDidUpdate() {

    }

    componentWillUnmount() {

    }

    init() {
        getRecruitNameList();
        this.doQuery(this.props.list);
    }

    handleRefresh() {
        this.init();
    }

    doQuery(data, reload = false) {
        let pageParam = data.pageParam;
        // 点击查询按钮时，重置分页数据的逻辑
        let RecordIndex = pageParam.pageSize * (pageParam.currentPage - 1);
        if (reload) {
            RecordIndex = 0;
            setParams(this.STATE_NAME, {pageParam: Object.assign({}, pageParam, {currentPage: 1})});
            return;
        }
        let queryData = Object.keys(data.queryParams).reduce((obj, key) => Object.assign(obj, {[key]: data.queryParams[key].value}), {});
        if (queryData.EntryCallbackStatus == -9999) queryData.EntryCallbackStatus = null;
        if (queryData.StartDate && moment(queryData.StartDate).isValid()) queryData.StartDate = queryData.StartDate.format('YYYY-MM-DD');
        else queryData.StartDate = '';
        if (queryData.StopDate && moment(queryData.StopDate).isValid()) queryData.StopDate = queryData.StopDate.format('YYYY-MM-DD');
        else queryData.StopDate = '';
        getCallbackWorkingList({
            OrderParams: data.orderParams,
            QueryParams: queryData,
            RecordIndex: RecordIndex,
            RecordSize: pageParam.pageSize
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
        let data = this.props.list;
        setParams(this.STATE_NAME, {[paramName]: Object.assign({}, data[paramName], {[key]: value})});
    }

    handleChangeTmpReply(index, e) {
        this.changeTmpReply(index, e.target.value);
    }

    changeTmpReply(index, val) {
        let replyObj = Object.assign({}, this.props.list.tmpReplyObj, {[index]: val});
        updateWorkingReply(replyObj);
    }

    handleClickSetReply(item, index, e) {
        let replyStr = this.props.list.tmpReplyObj[index];
        if (replyStr == '' || replyStr == undefined || replyStr == null) return;
        if (replyStr.length < 5) {
            message.info('联系记录不得少于五个字');
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

    handleDoSorter(sorter) {
        if (!sorter || !sorter.columnKey) return;
        let key = sorter.columnKey;
        key = 'CheckinTime';
        let order = sorter.order == 'descend' ? 1 : 0;
        let data = this.props.list;
        setParams(data.state_name, {orderParams: {Key: [key], Order: order}});
    }

    render() {
        let data = this.props.list;
        let recruitNameList = this.props.AllRecruitListData.RecordList;
        return (
            <div className='callback-working-view'>
                <div className="ivy-page-title">
                    <h1>入职一周的会员</h1>
                    <div className="float-right">
                        <Icon type="reload" className="ml-8" style={{fontSize: '16px'}}
                              onClick={() => this.handleRefresh()}/>
                    </div>
                </div>
                <div className="container-fluid">
                    <div className="container bg-white mt-20">
                        <SearchFrom handleSearch={() => this.doQuery(data, true)}
                                    dataSource={{
                                        recruitFilterList: recruitNameList
                                    }}
                                    state_name={data.state_name}
                                    queryParams={data.queryParams}
                                    formItems={this.formItems}></SearchFrom>
                        <Table columns={this.tableColumns(data.orderParams.Order)}
                               rowKey={(record, index) => index}
                               dataSource={data.RecordList} bordered={true}
                               onChange={(pagination, filters, sorter) => {
                                   this.handleDoSorter(sorter);
                               }}
                               pagination={{
                                   total: data.RecordCount,
                                   pageSize: data.pageParam.pageSize,
                                   current: data.pageParam.currentPage,
                                   onChange: (page, pageSize) => setParams(data.state_name, {
                                       pageParam: {currentPage: page, pageSize: pageSize}
                                   }),
                                   onShowSizeChange: (current, size) => setParams(data.state_name, {
                                       pageParam: {currentPage: current, pageSize: size}
                                   }),
                                   showSizeChanger: true,
                                   showQuickJumper: true,
                                   pageSizeOptions: ["20", "40", "60", "80", "120"],
                                   showTotal: (total, range) => `第${range[0]}-${range[1]}条 共${total}条`
                               }}></Table>
                    </div>
                </div>
            </div>
        );
    }

    tableColumns(Ordered) {
        let data = this.props.list;
        let RecordIndex = (data.pageParam.currentPage - 1) * data.pageParam.pageSize;
        return [
            {
                title: '序号', key: 'rowKey',
                render: (text, record, index) => RecordIndex + index + 1
            },
            {
                title: '签到日期', key: 'Checkin', sorter: true, sortOrder: Ordered == 0 ? "ascend" : "descend",
                render: (text, record) => {
                    return (
                        <div>{record.Checkin && moment(record.Checkin).isValid() ? moment(record.Checkin).format('YYYY-MM-DD HH:mm') : ''}</div>);
                }
            },
            {
                title: '真实姓名', key: 'UserName',
                render: (text, item) => (<div className="color-primary"
                                              onClick={() => this.handleClickUser(item.UserID, item.UserName)}>{item.UserName}</div>)
            },
            {title: '入职企业', dataIndex: 'CheckinRecruitName'},
            {
                title: '入职天数',
                key: 'EntryDays',
                render: (text, record) => record.EntryDays != undefined && record.EntryDays != null ? record.EntryDays + '天' : ''
            },
            {title: '最近联系记录', dataIndex: 'CallbackContent'},
            {
                title: '填写联系记录',
                key: 'WorkCardStatus',
                render: (text, record, index) => (
                    <Input addonBefore={<Icon type="phone"/>}
                           value={data.tmpReplyObj[index] || ''}
                           placeholder="输入联系记录"
                           maxLength="120"
                           onChange={this.handleChangeTmpReply.bind(this, index)}
                           addonAfter={<div onClick={this.handleClickSetReply.bind(this, record, index)}><span
                               className="color-primary">保存</span></div>}/>
                )
            },
            {
                title: '联系状态',
                key: 'EntryCallbackStatus',
                render: (text, record) => this.eCallbackStatus[record.EntryCallbackStatus] ? this.eCallbackStatus[record.EntryCallbackStatus] : ''
            }
        ];
    }
}