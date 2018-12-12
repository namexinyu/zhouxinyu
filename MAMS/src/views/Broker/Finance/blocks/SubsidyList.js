import React from 'react';
import { Link } from 'react-router';
import {Card, Row, Col, Button, Table, Modal, Alert, Radio} from 'antd';
import SearchFrom from "COMPONENT/SearchForm/index";
import setParams from "ACTION/setParams";
import moment from 'moment';
// 业务相关
import FinanceAction from 'ACTION/Broker/Finance/FinanceAction';
import AssistanceNewModal from 'VIEW/Broker/Assistance/blocks/AssistanceNewModal';
import mams, {CurrentPlatformCode} from 'CONFIG/mamsConfig';
import {DataTransfer, paramTransfer} from 'UTIL/base/CommonUtils';
import {RegexRule, Constant} from 'UTIL/constant/index';

const RadioGroup = Radio.Group;

export default class SubsidyList extends React.PureComponent {
    constructor(props) {
        super(props);
        this.handleRightClick = this.handleRightClick.bind(this);
        this.eRecruitType = {
            1: '周薪薪',
            2: '非周薪薪'
        };
        this.eSettleStatus = {
            1: '待审核',
            2: '已发放到余额',
            3: '已作废'
        };
        // 1.已入职未申请 2.已入职申请中 3.已入职已申请 4.未入职 5.已入职已作废 6.已入职已发放
        this.eHireStatus = {
            1: '未入职',
            2: '已入职'
        };
        // this.eHireStatus = {
        //     1: '已入职未申请',
        //     2: '已入职申请中',
        //     3: '已入职已申请',
        //     4: '未入职',
        //     5: '已入职已作废',
        //     6: '已入职已发放'
        // };
        // 0:未处理、1:已处理
        this.eFinHandleStatus = {
            0: '未处理',
            1: '已处理'
        };
        // 1：待审核 2：已发放 3：已作废
        this.eFinAuditStatus = {
            1: '待审核',
            2: '已发放到余额',
            3: '已作废'
        };
        // 0:未上传、1:审核中、2:审核不通过、3:审核通过
        this.eCheckInAuditStatus = {
            0: '未上传',
            1: '审核中',
            2: '审核不通过',
            3: '审核通过'
        };
        this.formItems = [
            {
                name: 'CheckinTime',
                label: "签到日期",
                itemType: 'RangePicker',
                placeholder: ['开始日期', '截止日期']
            },
            {name: 'UserName', label: "姓名", itemType: 'Input', placeholder: '输入姓名'},
            // {name: 'IDCardNum', label: "身份证号", itemType: 'Input', placeholder: '输入身份证'},
            {name: 'Mobile', label: "手机号", itemType: 'Input', placeholder: '输入手机号'},
            {name: 'RecruitName', label: "企业名称", itemType: 'Input', placeholder: '输入企业'},
            {
                name: 'RecruitType',
                label: "企业筛选",
                itemType: 'Select',
                type: 'enum',
                enum: this.eRecruitType
            },
            {
                name: 'HireStatus',
                label: "入职情况",
                itemType: 'Select',
                type: 'enum',
                enum: this.eHireStatus
            },
            {
                name: 'SettleStatus',
                label: "到账情况",
                itemType: 'Select',
                type: 'enum',
                enum: this.eSettleStatus
            }
        ];
    }

    componentWillMount() {
        let location = this.props.location;
        if (location.lastKey !== location.key && !(location.state && location.state.clickTab)) {
            this.doQuery(this.props.list);
        }
    }

    componentWillReceiveProps(nextProps) {
        // 翻页
        if (nextProps.list.pageParam !== this.props.list.pageParam) {
            this.doQuery(nextProps.list);
        }
    }

    handleSearch() {
        let data = this.props.list;
        if (data.pageParam.currentPage == 1) {
            this.doQuery(data);
        } else {
            let pageParam = {...data.pageParam};
            pageParam.currentPage = 1;
            setParams(data.state_name, {pageParam});
        }
    }

    doQuery(d) {
        let data = d || this.props.list;
        let param = {
            RecordIndex: data.pageParam.pageSize * (data.pageParam.currentPage - 1),
            RecordSize: data.pageParam.pageSize,
            OrderBy: 1
        };
        Object.keys(data.queryParams).forEach((key) => {
            if (['HireStatus', 'RecruitType', 'SettleStatus'].indexOf(key) != -1) {
                param[key] = data.queryParams[key].value == '-9999' ? 0 : data.queryParams[key].value - 0;
            } else {
                param[key] = data.queryParams[key].value;
            }
        });
        if (param.CheckinTime && param.CheckinTime.length == 2) {
            param.CheckinTimeStart = param.CheckinTime[0] && moment(param.CheckinTime[0]).isValid() ? param.CheckinTime[0].format('YYYY-MM-DD 00:00:00') : '';
            param.CheckinTimeEnd = param.CheckinTime[1] && moment(param.CheckinTime[1]).isValid() ? param.CheckinTime[1].format('YYYY-MM-DD 23:59:59') : '';
        } else {
            param.CheckinTimeStart = '';
            param.CheckinTimeEnd = '';
        }
        delete param.CheckinTime;
        FinanceAction.GetFinanceSubsidyList(param);
    }

    handleRightClick(record, index, e) {
        if (e) e.preventDefault();
        let user = {
            UserID: record.UserID,
            UserName: record.UserName,
            Mobile: record.Moblie
        };
        let param = {
            Recruit: {value: {value: record.CheckinRecruitID, text: record.CheckinRecruitName}},
            CheckinDate: {
                value: record.CheckinTime && moment(record.CheckinTime).isValid() ?
                    moment(record.CheckinTime) : undefined
            },
            Mobile: {value: record.Moblie},
            Content: {value: ''},
            TargetDepartID: {value: 'finance'}
        };
        setParams(this.props.asNew.state_name, {showModal: true, User: user, Data: param});
    }

    render() {
        let data = this.props.list;
        return (
            <div>
                <div className="ivy-page-title">
                    <h1>已申请的补贴</h1>
                </div>
                <div className="container-fluid">
                    <div className="container bg-white mt-20">
                        <SearchFrom handleSearch={() => this.handleSearch()}
                                    dataSource={{EmployeeSimpleList: data.EmployeeSimpleList}}
                                    queryParams={data.queryParams}
                                    state_name={data.state_name}
                                    formItems={this.formItems} className="mb-10" />
                        {/* <Alert message="右键可向财务部门发号施令哦" type="info" style={{margin: "10px 0"}} showIcon/> */}
                        <Table columns={this.tableColumns()}
                               rowKey={(record, index) => index}
                               bordered={true}
                               loading={data.RecordListLoading}
                               dataSource={data.RecordList}
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
                                   pageSizeOptions: Constant.pageSizeOptions,
                                   showTotal: (total, range) => `第${range[0]}-${range[1]}条 共${total}条`
                               }}></Table>
                    </div>
                </div>
                {this.props.asNew.showModal ? <AssistanceNewModal asNew={this.props.asNew}
                                                                  recruitNameList={this.props.recruitNameList}></AssistanceNewModal> : ''}
            </div>);
    }

    tableColumns() {
        return [
            {
                title: '序号', key: 'seqNo', width: 42,
                render: (text, record, index) => index + 1
            },
            {title: '姓名', dataIndex: 'UserName', render: (text, record) => {
                return <Link to={`/broker/member/detail/${record.UserID}?memberName=${record.UserName || record.UserCallName || record.UserNickName}`}>{record.UserName || record.UserCallName || record.UserNickName}</Link>;
            }},
            // {title: '身份证', dataIndex: 'IDCardNum'},
            {
                title: '手机号码', key: 'Moblie', render: (text, record) => {
                return DataTransfer.phone(record.Moblie);
            }
            },
            {title: '补贴详情', dataIndex: 'SubsidyDetail'},
            {title: '企业', dataIndex: 'CheckinRecruitName'},
            {
                title: '考勤', key: 'CheckInAuditStatus',
                render: (text, record) => this.eCheckInAuditStatus[record.CheckInAuditStatus] || ''
            },
            {
                title: '财务审核', key: 'FinAuditStatus',
                render: (text, record) => this.eFinAuditStatus[record.FinAuditStatus] || ''
            },
            {title: '作废原因', dataIndex: 'FinAuditRemarks'},
            {
                title: '补贴金额', key: 'AccountSubsidy',
                render: (text, record) => record.AccountSubsidy ? `${((record.AccountSubsidy || 0) / 100).FormatMoney({fixed: 2})}元` : ''
            },
            {
                title: '面试日期', key: 'InverviewDate',
                render: (text, record) => record.InverviewDate && moment(record.InverviewDate).isValid() ? moment(record.InverviewDate).format('YYYY/MM/DD') : ''
            },
            {
                title: '申请时间', key: 'dtSubsidyApply',
                render: (text, record) => {
                    const t = record.dtSubsidyApply;
                    return t && moment(t).isValid() ? moment(t).format('YYYY/MM/DD HH:mm') : '';
                }
            }

        ];
    }
}