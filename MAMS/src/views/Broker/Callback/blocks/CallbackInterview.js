import React from 'react';
import 'SCSS/pages/broker/callback-interview-view.scss';
import {Form, Row, Col, Button, Input, Select, Table, Icon, DatePicker, message, Badge} from 'antd';
import getAllRecruitData from 'ACTION/Broker/GetAllRecruitListIncludeForbid';
import SearchFrom from "COMPONENT/SearchForm/index";
import setParams from 'ACTION/setParams';
import resetQueryParams from 'ACTION/resetQueryParams';
import moment from 'moment';
import {browserHistory} from 'react-router';
// 业务相关
import getCallBackInterviewList from 'ACTION/Broker/CallbackInterview/getCallbackInterviewList';
import updateInterviewReply from 'ACTION/Broker/CallbackInterview/updateInterviewReply';
import setInterviewReply from 'ACTION/Broker/CallbackInterview/setInterviewReply';
import EnumInterview from 'CONFIG/EnumerateLib/Mapping_Interview';
import EnumUser from 'CONFIG/EnumerateLib/Mapping_User';
import getRecruitNameList from 'ACTION/Broker/Recruit/getRecruitNameList';
import ActionMAMSRecruitment from 'ACTION/Common/Recruitment/ActionMAMSRecruitment';

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
        this.formItems = [
            {name: 'StartDate', label: "开始日期", itemType: 'DatePicker', placeholder: '开始日期'},
            {name: 'StopDate', label: "截止日期", itemType: 'DatePicker', placeholder: '截止日期'},
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
                name: 'CallbackStatus',
                label: '是否联系',
                itemType: 'Select',
                type: 'enum',
                enum: this.eCallbackStatus
            },
            {
                name: 'InterviewStatus',
                label: '面试结果',
                itemType: 'Checkbox',
                enum: this.eResult,
                colSpan: 2,
                offset: 0
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
        if (nextData.setInterviewReplyFetch.status == 'success' && nowData.setInterviewReplyFetch.status != 'success') {
            // let updateUserId = nowData.setInterviewReplyFetch.params.UserOrderID;
            // let index = nowData.interviewList.findIndex((item) => item.UserOrderID == updateUserId);
            // this.changeTmpReply(index, '');
            setParams(this.STATE_NAME, {setInterviewReplyFetch: {status: 'close'}});
            message.info('联系记录已添加');
            this.doQuery(nowData);
        } else if (nextData.setInterviewReplyFetch.status == 'error' && nowData.setInterviewReplyFetch.status != 'error') {
            setParams(this.STATE_NAME, {setInterviewReplyFetch: {status: 'close'}});
            message.info('联系记录添加失败');
        }
    }

    componentDidUpdate() {

    }

    componentWillUnmount() {
    }

    init(reload) {
        if (reload || this.props.recruitList.recruitNameList.length == 0) {
            getRecruitNameList();
        }
        // let queryParams = this.props.list.queryParams;
        // queryParams.InterviewStatus = this.eResultList;
        this.doQuery(this.props.list);
    }

    handleRefresh() {
        this.init(true);
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
        if (queryData.CallbackStatus == -9999) queryData.CallbackStatus = null;
        if (queryData.StartDate) queryData.StartDate = queryData.StartDate.format('YYYY-MM-DD');
        else queryData.StartDate = '';
        if (queryData.StopDate) queryData.StopDate = queryData.StopDate.format('YYYY-MM-DD');
        else queryData.StopDate = '';
        queryData.CheckinRecruitID = queryData.CheckinRecruit.value;
        delete queryData.CheckinRecruit;
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

        getCallBackInterviewList({
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

    handleSetMultiSelectParam(key, value, paramName = 'queryParams') {
        let data = this.props.list;
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
        let replyObj = Object.assign({}, this.props.list.tmpReplyObj, {[index]: val});
        updateInterviewReply(replyObj);
    }

    handleClickSetReply(item, index, e) {
        let replyStr = this.props.list.tmpReplyObj[index];
        if (replyStr == '' || replyStr == undefined || replyStr == null) return;
        if (replyStr.length < 5) {
            message.info('联系记录不得少于五个字');
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
            <div className='callback-interview-view'>
                <div className="ivy-page-title">
                    <h1>面试回访</h1>
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
            {title: '面试企业', dataIndex: 'CheckinRecruitName'},
            {title: '面试结果', key: 'InterviewStatus', render: (text, record) => this.mapInterviewStatusText(record)},
            {title: '最近联系记录', dataIndex: 'CallbackContent'},
            {
                title: '填写联系记录',
                key: 'WorkCardStatus',
                render: (text, record, index) => (
                    <Input addonBefore={<Icon type="phone"/>}
                           placeholder="输入联系记录"
                           maxLength="120"
                           value={data.tmpReplyObj[index] || ''}
                           onChange={this.handleChangeTmpReply.bind(this, index)}
                           addonAfter={<div onClick={this.handleClickSetReply.bind(this, record, index)}><span
                               className="color-primary">保存</span></div>}/>
                )
            },
            {
                title: '联系状态',
                key: 'CallbackStatus',
                render: (text, record) => this.eCallbackStatus[record.CallbackStatus] ? this.eCallbackStatus[record.CallbackStatus] : ''
            }
        ];
    }
}