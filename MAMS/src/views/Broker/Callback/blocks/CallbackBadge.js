import React from 'react';
import 'SCSS/pages/broker/callback-badge-view.scss';
import {Form, Row, Col, Button, Input, Select, Table, Icon, DatePicker, message, Badge} from 'antd';
import SearchFrom from "COMPONENT/SearchForm/index";
import setParams from 'ACTION/setParams';
import resetQueryParams from 'ACTION/resetQueryParams';
import {browserHistory} from 'react-router';
import moment from 'moment';
// 业务相关
import EnumInterview from 'CONFIG/EnumerateLib/Mapping_Interview';
import getAllRecruitData from 'ACTION/Broker/GetAllRecruitListIncludeForbid';
import getCallBackBadgeList from 'ACTION/Broker/CallbackBadge/getCallbackBadgeList';
import getRecruitNameList from 'ACTION/Broker/Recruit/getRecruitNameList';
import ActionMAMSRecruitment from 'ACTION/Common/Recruitment/ActionMAMSRecruitment';

export default class CallbackBadge extends React.PureComponent {
    constructor(props) {
        super(props);
        this.STATE_NAME = 'state_broker_callbackBadge';
        this.eBadgeStatus = Object.assign({}, EnumInterview.eBadgeStatus);
        // this.eBadgeStatus[0] = '请选择';
        this.eBadgeStatusList = Object.keys(this.eBadgeStatus).map((v) => v - 0);
        this.eResultComplex = Object.assign({}, EnumInterview.eResultComplex);
        this.eResult = Object.keys(EnumInterview.eResultComplex).reduce((obj, key) => Object.assign(obj, {[key]: EnumInterview.eResultComplex[key].value}), {});
        this.eResultComplexList = Object.keys(this.eResultComplex).map((v) => v - 0);
        // disabledDate={(d) => this.isManager ? false : moment().diff(d, 'days') > 2}
        this.formItems = [
            {
                name: 'StartDate', label: "开始日期",
                itemType: 'DatePicker', placeholder: '开始日期'
            },
            {
                name: 'StopDate', label: "截止日期", allowClear: false,
                itemType: 'DatePicker', placeholder: '截止日期',
                disabledDate: (d) => moment().diff(d, 'days') < 2
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
                name: 'WorkCardStatus',
                label: '工牌状态',
                itemType: 'Checkbox',
                enum: this.eBadgeStatus,
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

    }

    componentDidUpdate() {

    }

    componentWillUnmount() {

    }

    init() {
        getRecruitNameList();
        let data = this.props.list;
        this.doQuery(data);
    }

    handleRefresh() {
        this.init();
    }

    doQuery(data, reload = false) {
        let pageParam = data.pageParam;
        let queryData = Object.keys(data.queryParams).reduce((obj, key) => Object.assign(obj, {[key]: data.queryParams[key].value}), {});
        if (queryData.WorkCardStatus.length == this.eBadgeStatusList.length) queryData.WorkCardStatus = [];
        else queryData.WorkCardStatus = queryData.WorkCardStatus.join(',');

        if (queryData.StartDate) queryData.StartDate = queryData.StartDate.format('YYYY-MM-DD');
        else queryData.StartDate = '';
        if (queryData.StopDate) queryData.StopDate = queryData.StopDate.format('YYYY-MM-DD');
        else queryData.StopDate = '';
        queryData.CheckinRecruitID = queryData.CheckinRecruit.value;
        delete queryData.CheckinRecruit;
        // 点击查询按钮时，重置分页数据的逻辑
        let RecordIndex = pageParam.pageSize * (pageParam.currentPage - 1);
        if (reload) {
            RecordIndex = 0;
            setParams(this.STATE_NAME, {pageParam: Object.assign({}, pageParam, {currentPage: 1})});
            return;
        }
        getCallBackBadgeList({
            OrderParams: data.orderParams,
            QueryParams: queryData,
            RecordIndex: RecordIndex,
            RecordSize: pageParam.pageSize
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
            <div className='callback-badge-view'>
                <div className="ivy-page-title">
                    <h1>入职三天未上传工牌职员</h1>
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
            {title: '签到企业', dataIndex: 'CheckinRecruitName'},
            {title: '面试状态', key: 'InterviewStatus', render: (text, record) => this.mapInterviewStatusText(record)},
            {
                title: '入职天数',
                key: 'EntryDays',
                render: (text, record) => record.EntryDays != undefined && record.EntryDays != null ? record.EntryDays + '天' : ''
            },
            {
                title: '工牌状态',
                key: 'WorkCardStatus',
                render: (text, record) => this.eBadgeStatus[record.WorkCardStatus] ? this.eBadgeStatus[record.WorkCardStatus] : ''
            },
            {title: '备注', dataIndex: 'vReason'}
        ];
    }
}