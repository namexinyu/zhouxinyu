import React from 'react';
import {Form, Row, Col, Button, Input, Select, Table, DatePicker, message, Badge} from 'antd';
import setParams from "ACTION/setParams";
import {CONFIG} from 'mams-com';
const {AppSessionStorage} = CONFIG;
import moment from 'moment';
import resetState from 'ACTION/resetState';
import SearchFrom from "COMPONENT/SearchForm/index";
// 业务相关
import EnumAssistance from 'CONFIG/EnumerateLib/Mapping_Assistance';
import GetDepartEntrustListMy from "ACTION/Common/Assistance/GetDepartEntrustListMy";
import mams, {CurrentPlatformCode} from 'CONFIG/mamsConfig';
import AssistanceNewModal from "./AssistanceNewModal";
import AssistanceReplyModal from "./AssistanceReplyModal";


export default class AssistanceListMy extends React.PureComponent {
    constructor(props) {
        super(props);
        this.eStatus = Object.assign({}, EnumAssistance.eStatus);
        this.eCloseStatus = Object.assign({}, EnumAssistance.eCloseStatus);
        this.eIsNewMsgStatus = Object.assign({}, EnumAssistance.eIsNewMsgStatus);
        this.eGradeLevel = Object.assign({}, EnumAssistance.eGradeLevel);
        this.TargetDepartEnum = {};
        Object.keys(mams).forEach((key) => {
            if (mams[key].acceptAssistance && key != CurrentPlatformCode) {
                this.TargetDepartEnum[key] = mams[key].department;
            }
        });
        this.AllDepartEnum = {};
        Object.keys(mams).forEach((key) => {
            this.AllDepartEnum[key] = mams[key].department;
        });
        this.columns = [
            {
                title: '序号', key: 'rowKey',
                render: (text, record) => record.rowKey + 1
            },
            {
                title: '创建时间', key: 'CreateTime', sorter: true,
                render: (text, record) => {
                    return (
                        <div>{record.CreateTime ? moment(record.CreateTime).format('YYYY/MM/DD HH:mm') : ''}</div>);
                }
            },
            {
                title: '指派部门', key: 'TargetPlatformCode',
                render: (text, record) => {
                    return (
                        <div>{this.AllDepartEnum[record.TargetPlatformCode]}</div>);
                }
            },
            {title: '处理人', dataIndex: 'HandlePerson'},
            {
                title: '委托问题', key: 'Content',
                render: (text, record) =>
                    <div title={record.Content}>
                        {record.Content && record.Content.length > 25 ? record.Content.substr(0, 20) + '...' : record.Content}
                    </div>
            },
            {title: '最近回复人', dataIndex: 'ReplyPerson'},
            {
                title: '未读消息数量', key: 'NoReadNum',
                render: (text, record) => {
                    if (record.NoReadNum > 0) return (
                        <div><Badge count={record.NoReadNum}/></div>);
                    return '';
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
                name: 'TargetDepartID',
                label: "指派部门",
                itemType: 'Select',
                type: 'enum',
                enum: this.TargetDepartEnum
                // optionKey: 'DepartID',
                // optionValue: 'DepartName'
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
            {
                name: 'Content',
                label: "委托问题",
                itemType: 'Input',
                placeholder: '问题内容'
                // rules: [{required: true, message: "必须输入问题内容"}]
            },
            {name: 'CloseStatus', label: "结案状态", itemType: 'Select', type: 'enum', enum: this.eCloseStatus},
            {name: 'IsNewMsg', label: "未读消息", itemType: 'Select', type: 'enum', enum: this.eIsNewMsgStatus},
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
        if (nextProps.list.currentPage !== this.props.list.currentPage
            || nextProps.list.needRefresh && !this.props.needRefresh
            || (nextProps.detail.Data !== this.props.detail.Data && !nextProps.detail.Data)) {
            this.doQuery(nextProps.list);
        }
        let nNew = nextProps.assistanceNew;
        let newFetch = nNew.BuildDepartEntrustFetch;
        if (newFetch.status == "success" && this.props.assistanceNew.BuildDepartEntrustFetch.status == "pending") {
            message.info("新增委托成功");
            resetState(nNew.state_name);
            this.doQuery(this.props.list);
        } else if (newFetch.status == "error" && this.props.assistanceNew.BuildDepartEntrustFetch.status == "pending") {
            let res = newFetch.response;
            let text = '';
            if (res && res.Desc) text = ':' + res.Desc;
            message.info("新增委托失败" + text);
            setParams(nNew.state_name, {BuildDepartEntrustFetch: {status: "close"}});
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
        let data = this.props.charge;
        setParams(data.state_name, {[paramName]: Object.assign({}, data[paramName], {[key]: value})});
    }

    init(reload = false) {
        this.doQuery(this.props.list);
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
        let queryParams = Object.assign({}, data.queryParams);
        for (let key of ["IsNewMsg", "CloseStatus", "Grade"]) {
            if (queryParams[key] && queryParams[key].value == '-9999') delete queryParams[key];
            else if (queryParams[key]) queryParams[key] = {value: queryParams[key].value - 0};
        }
        // 替换指派部门为指派平台
        if (queryParams.TargetDepartID && queryParams.TargetDepartID.value != '-9999') {
            queryParams.TargetPlatformCode = {value: queryParams.TargetDepartID.value};
        }
        delete queryParams.TargetDepartID;
        // 处理obj型value的模糊匹配字段{value::id,text::name}
        if (queryParams.HandleEmployeeName && queryParams.HandleEmployeeName.value) {
            queryParams.HandleEmployeeID = {value: queryParams.HandleEmployeeName.value.value - 0};
        }
        delete queryParams.HandleEmployeeName;
        if (queryParams.StartDate.value) queryParams.StartDate.value = queryParams.StartDate.value.format("YYYY-MM-DD");
        if (queryParams.StopDate.value) queryParams.StopDate.value = queryParams.StopDate.value.format("YYYY-MM-DD");
        queryParams.EntrustEmployeeID = {value: AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('employeeId')};
        GetDepartEntrustListMy({
            EmployeeID: AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('employeeId'),
            ListType: 2, // 处理委托
            RecordIndex: data.pageSize * (data.currentPage - 1),
            RecordSize: data.pageSize,
            QueryParams: queryParams
        });
    }

    render() {
        let data = this.props.list;
        let asNew = this.props.assistanceNew;
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
                        <Row>
                            <Col>
                                <Button type="primary"
                                        onClick={() => setParams(asNew.state_name, {showModal: true})}>新建委托</Button>
                            </Col>
                        </Row>
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
                <AssistanceNewModal asNew={asNew}></AssistanceNewModal>
                {detail.Data ? (<AssistanceReplyModal replyList={this.props.replyList}
                                                      detail={this.props.detail}></AssistanceReplyModal>) : ''}

            </Row>
        );
    }
}