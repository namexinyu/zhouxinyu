import React from 'react';
import {Form, Row, Col, Button, Input, Select, Table, DatePicker, message} from 'antd';
import setParams from "ACTION/setParams";
import AppSessionStorage from "CONFIG/SessionStorage/AppSessionStorage";
import moment from 'moment';
import SearchFrom from "COMPONENT/SearchForm/index";
// 业务相关
import EnumAssistance from 'CONFIG/EnumerateLib/Mapping_Assistance';
import AssistanceReplyModal from "./AssistanceReplyModal";
import GetDepartEntrustList from "ACTION/Common/Assistance/GetDepartEntrustList";
import mams, {CurrentPlatformCode} from 'CONFIG/mamsConfig';

export default class AssistanceList extends React.PureComponent {
    constructor(props) {
        super(props);
        this.eStatus = Object.assign({}, EnumAssistance.eStatus);
        this.eCloseStatus = Object.assign({}, EnumAssistance.eCloseStatus);
        this.eIsNewMsgStatus = Object.assign({}, EnumAssistance.eIsNewMsgStatus);
        this.eGradeLevel = Object.assign({}, EnumAssistance.eGradeLevel);
        this.SourceDepartEnum = {};
        Object.keys(mams).forEach((key) => {
            if (mams[key].buildAssistance) {
                this.SourceDepartEnum[key] = mams[key].department;
            }
        });
        this.AllDepartEnum = {};
        Object.keys(mams).forEach((key) => {
            this.AllDepartEnum[key] = mams[key].department;
        });
        /*
            StartDate: {value: undefined},
            StopDate: {value: undefined},
            SourceDepartID: {value: '-9999'},
            SourceEmployeeName: {value: ''},
            HandleEmployeeID: {value: undefined},
            CloseStatus: {value: '-9999'},
            Grade: {value: '-9999'}
         */
        this.columns = [
            {
                title: '序号', key: 'rowKey',
                render: (text, record, index) => index + 1
            },
            {
                title: '创建时间', key: 'CreateTime', sorter: true,
                render: (text, record) => {
                    return (
                        <div>{record.CreateTime ? moment(record.CreateTime).format('YYYY/MM/DD HH:mm') : ''}</div>);
                }
            },
            // {title: '委托部门', dataIndex: 'SourceDepartName'},
            {
                title: '委托部门', key: 'SourcePlatformCode',
                render: (text, record) => {
                    return (
                        <div>{this.AllDepartEnum[record.SourcePlatformCode]}</div>);
                }
            },
            {
                title: '委托人', key: 'EntrustPerson',
                render: (text, record) => {
                    return (
                        <div>{record.EntrustPerson + (record.EntrustPersonName ? `(${record.EntrustPersonName})` : '')}</div>);
                }
            },
            {
                title: '委托问题', key: 'Content',
                render: (text, record) =>
                    <div title={record.Content}>
                        {record.Content && record.Content.length > 25 ? record.Content.substr(0, 20) + '...' : record.Content}
                    </div>
            },
            {title: '处理人', dataIndex: 'HandlePerson'},
            {
                title: '委托状态', key: 'EntrustStatus',
                render: (text, record) => {
                    return (<div className={record.EntrustStatus == 2 ? 'color-success' : 'color-danger'}>
                        {this.eStatus[record.EntrustStatus]}
                    </div>);
                }
            },
            {
                title: '结案状态', key: 'CloseStatus',
                render: (text, record) => {
                    return (<div>{this.eCloseStatus[record.CloseStatus]}</div>);
                }
            },
            {
                title: '评价满意度', key: 'Grade',
                render: (text, record) => {
                    return (<div>{this.eGradeLevel[record.Grade]}</div>);
                }
            },
            {title: '不满意原因', dataIndex: 'GradeComment'}
        ];
        this.formItems = [
            {name: 'StartDate', label: "开始日期", itemType: 'DatePicker', placeholder: '开始日期'},
            {name: 'StopDate', label: "截止日期", itemType: 'DatePicker', placeholder: '截止日期'},
            {
                name: 'SourceDepartID',
                label: "委托部门",
                itemType: 'Select',
                type: 'enum',
                enum: this.SourceDepartEnum
                // optionKey: 'DepartID',
                // optionValue: 'DepartName'
            },
            {
                name: 'SourceEmployeeName',
                // value: props.list.queryParams.SourceEmployeeName.value,
                label: "委托人",
                itemType: 'AutoCompleteInput',
                valueKey: 'EmployeeID',
                textKey: 'LoginName',
                dataArray: "employeeFilterList",
                placeholder: '委托人英文名'
            },
            {
                name: 'HandleEmployeeName',
                label: "处理人",
                itemType: 'AutoCompleteInput',
                placeholder: '处理人英文名',
                valueKey: 'EmployeeID',
                textKey: 'LoginName',
                dataArray: "employeeFilterList"
            },
            {name: 'EntrustStatus', label: "委托状态", itemType: 'Select', type: 'enum', enum: this.eStatus},
            {name: 'CloseStatus', label: "结案状态", itemType: 'Select', type: 'enum', enum: this.eCloseStatus},
            {name: 'Grade', label: "满意度", itemType: 'Select', type: 'enum', enum: this.eGradeLevel}
        ];
    }


    componentWillMount() {
        let location = this.props.location;
        if (location.lastKey !== location.key && !(location.state && location.state.clickTab)) {
            this.init();
        }
    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {
        // 翻页 以及 弹窗关闭
        // || nextProps.list.orderParams !== this.props.list.orderParams
        if (nextProps.list.currentPage !== this.props.list.currentPage
            || nextProps.list.needRefresh && !this.props.needRefresh
            || (nextProps.detail.Data !== this.props.detail.Data && !nextProps.detail.Data)) {
            this.doQuery(nextProps.list);
        }
    }

    componentWillUpdate(nextProps, nextState) {

    }

    componentDidUpdate() {

    }

    componentWillUnmount() {

    }

    handleRowClick(record) {
        setParams(this.props.detail.state_name, {ID: record.EntrustID, Data: Object.assign({}, record)});
    }

    handleSetParam(key, value, paramName = 'queryParams') {
        let data = this.props.list;
        setParams(data.state_name, {[paramName]: Object.assign({}, data[paramName], {[key]: value})});
    }

    init(reload = false) {
        this.doQuery(this.props.list, reload);
    }

    handleSearch() {
        let data = this.props.list;
        if (data.currentPage == 1) {
            this.doQuery(data);
        } else {
            setParams(data.state_name, {currentPage: 1});
        }
    }

    doQuery(data) {
        let queryParams = {};
        for (let key of Object.keys(data.queryParams)) {
            queryParams[key] = Object.assign({}, data.queryParams[key]);
        }
        for (let key of ["EntrustStatus", "CloseStatus", "Grade"]) {
            if (queryParams[key] && queryParams[key].value == '-9999') delete queryParams[key];
            else if (queryParams[key]) queryParams[key] = {value: queryParams[key].value - 0};
        }
        // 替换委托部门为委托平台
        if (queryParams.SourceDepartID && queryParams.SourceDepartID.value != '-9999') {
            queryParams.SourcePlatformCode = {value: queryParams.SourceDepartID.value};
        }
        delete queryParams.SourceDepartID;
        // 限制委托列表页只查看指派给当前部门的委托
        queryParams.TargetPlatformCode = {value: CurrentPlatformCode};
        // 处理obj型value的模糊匹配字段{value::id,text::name}
        if (queryParams.SourceEmployeeName && queryParams.SourceEmployeeName.value) {
            queryParams.EntrustEmployeeID = {value: queryParams.SourceEmployeeName.value.value - 0};
        }
        delete queryParams.SourceEmployeeName;
        if (queryParams.HandleEmployeeName && queryParams.HandleEmployeeName.value) {
            queryParams.HandleEmployeeID = {value: queryParams.HandleEmployeeName.value.value - 0};
        }
        delete queryParams.HandleEmployeeName;
        if (queryParams.StartDate.value) queryParams.StartDate.value = queryParams.StartDate.value.format("YYYY-MM-DD");
        if (queryParams.StopDate.value) queryParams.StopDate.value = queryParams.StopDate.value.format("YYYY-MM-DD");
        GetDepartEntrustList({
            EmployeeID: AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('employeeId'),
            ListType: 1, // 处理委托
            RecordIndex: data.pageSize * (data.currentPage - 1),
            RecordSize: data.pageSize,
            QueryParams: queryParams
        });

    }

    render() {
        let data = this.props.list;
        let detail = this.props.detail;
        return (
            <Row>
                <div className="container-fluid">
                    <div className="container bg-white mt-20">
                        <SearchFrom handleSearch={() => this.handleSearch()}
                                    dataSource={{
                                        employeeFilterList: this.props.employeeFilterList
                                    }}
                                    state_name={data.state_name}
                                    queryParams={data.queryParams}
                                    formItems={this.formItems}></SearchFrom>
                        <Table columns={this.columns}
                               rowKey={(record, index) => index}
                               onRowClick={(record) => this.handleRowClick(record)}
                               pagination={{
                                   current: data.currentPage,
                                   onChange: (page) => setParams(data.state_name, {currentPage: page}),
                                   total: data.totalSize
                               }}
                               dataSource={data.assistanceList}></Table>
                    </div>
                </div>
                {detail.Data ? (<AssistanceReplyModal replyList={this.props.replyList}
                                                      detail={this.props.detail}></AssistanceReplyModal>) : ''}

            </Row>
        );
    }
}