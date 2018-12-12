import React from 'react';
import {Card, Row, Col, Button, Table, Modal, Alert, Radio, message} from 'antd';
import { Link } from 'react-router';
import SearchFrom from "COMPONENT/SearchForm/index";
import setParams from "ACTION/setParams";
import moment from 'moment';
// 业务相关
import FinanceAction from 'ACTION/Broker/Finance/FinanceAction';
import AssistanceNewModal from 'VIEW/Broker/Assistance/blocks/AssistanceNewModal';
import mams, {CurrentPlatformCode} from 'CONFIG/mamsConfig';
import {RegexRule, Constant} from 'UTIL/constant/index';
import {DataTransfer, paramTransfer} from 'UTIL/base/CommonUtils';

const RadioGroup = Radio.Group;

export default class RecommendationList extends React.PureComponent {
    constructor(props) {
        super(props);
        this.handleRightClick = this.handleRightClick.bind(this);
        this.eEnrolState = {
            1: '未入职',
            2: '已入职'
        };
        this.eApplyStatus = {
            0: '未申请',
            1: '已申请'
        };
        // this.eEnrolState = {
        //     1: '已入职未申请',
        //     2: '已入职申请中',
        //     3: '已入职已申请',
        //     4: '未入职',
        //     5: '已入职已作废',
        //     6: '已入职已发放'
        // };
        // this.eEnrolStateList = [
        //     {key: 4, value: '未入职'},
        //     {key: 1, value: '已入职未申请'},
        //     {key: 2, value: '已入职申请中'},
        //     {key: 3, value: '已入职已申请'},
        //     {key: 5, value: '已入职已作废'},
        //     {key: 6, value: '已入职已发放'}
        // ];
        this.eFinanceDisposingState = {
            1: '未处理',
            2: '已发放到余额',
            3: '已作废'
        };
        this.formItems = [
            {
                name: 'InviteDate',
                label: "推荐日期",
                itemType: 'RangePicker',
                placeholder: ['开始日期', '截止日期']
            },
            {name: 'InvitedName', label: "被推荐人名字", itemType: 'Input', placeholder: '输入姓名'},
            {
                name: 'InvitedPhone', label: "被推荐人手机",
                itemType: 'Input', placeholder: '输入完整手机号'
            },
            {name: 'InviteName', label: "推荐人名字", itemType: 'Input', placeholder: '输入姓名'},
            {
                name: 'InvitePhone', label: "推荐人手机",
                itemType: 'Input', placeholder: '输入完整手机号'
            },
            {
                name: 'EnrolState',
                label: "是否入职",
                itemType: 'Select',
                type: 'enum',
                enum: this.eEnrolState
            },
            {
                name: 'ApplyStatus',
                label: "是否申请",
                itemType: 'Select',
                type: 'enum',
                enum: this.eApplyStatus
            },
            {
                name: 'FinanceDisposingState',
                label: "财务审核",
                itemType: 'Select',
                type: 'enum',
                enum: this.eFinanceDisposingState
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
            RecordStartIndex: data.pageParam.pageSize * (data.pageParam.currentPage - 1),
            RecordCount: data.pageParam.pageSize,
            SequenceCreateTime: 1
        };
        Object.keys(data.queryParams).forEach((key) => {
            if (['FinanceDisposingState', 'EnrolState', 'ApplyStatus'].indexOf(key) != -1) {
                param[key] = data.queryParams[key].value == '-9999' ? -1 : data.queryParams[key].value - 0;
            } else {
                param[key] = data.queryParams[key].value;
            }
        });
        if ((param.InvitePhone && !RegexRule.mobile.test(param.InvitePhone)) || (param.InvitedPhone && !RegexRule.mobile.test(param.InvitedPhone))) {
            message.destroy();
            message.info("手机号搜索需输入十一位完整号码");
            if (param.InvitePhone && !RegexRule.mobile.test(param.InvitePhone)) param.InvitePhone = '';
            if (param.InvitedPhone && !RegexRule.mobile.test(param.InvitedPhone)) param.InvitedPhone = '';
        }
        if (param.InviteDate && param.InviteDate.length == 2) {
            param.StartInviteDate = param.InviteDate[0] && moment(param.InviteDate[0]).isValid() ? param.InviteDate[0].format('YYYY-MM-DD') : '';
            param.EndInviteDate = param.InviteDate[1] && moment(param.InviteDate[1]).isValid() ? param.InviteDate[1].format('YYYY-MM-DD') : '';
        } else {
            param.StartInviteDate = '';
            param.EndInviteDate = '';
        }
        delete param.InviteDate;
        FinanceAction.GetFinanceRecommendationList(param);
    }

    handleRightClick(record, index, e) {
        if (e) e.preventDefault();
        let user = {
            UserID: record.InvitedUserID,
            UserName: record.InvitedName,
            Mobile: record.InvitedPhone
        };
        let param = {
            Recruit: {value: {value: record.CheckinRecruitID, text: record.CheckinRecruitName}},
            CheckinDate: {
                value: record.CheckinTime && moment(record.CheckinTime).isValid() ?
                    moment(record.CheckinTime) : undefined
            },
            Mobile: {value: record.InvitedPhone},
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
                    <h1>推荐费</h1>
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
                               }}>
                        </Table>
                    </div>
                </div>
                {this.props.asNew.showModal ? <AssistanceNewModal asNew={this.props.asNew}
                                                                  recruitNameList={this.props.recruitNameList}>
                </AssistanceNewModal> : ''}
            </div>);
    }

    tableColumns() {
        return [
            {
                title: '序号', key: 'seqNo', width: 42,
                render: (text, record, index) => index + 1
            },
            {
                title: '推荐人姓名', key: 'InviteName',
                render: (text, record) => {
                    return <Link to={`/broker/member/detail/${record.UserID}?memberName=${record.InviteName || record.InviteCallName || record.InviteNickName}`}>{record.InviteName || record.InviteCallName || record.InviteNickName}</Link>;
                }
                // render: (text, record) => record.InviteName || record.InviteCallName || record.InviteNickName
            },
            // {title: '被推荐人手机号', dataIndex: 'InvitedPhone'},
            {
                title: '手机号码', key: 'InvitePhone',
                render: (text, record) => {
                    return DataTransfer.phone(record.InvitePhone);
                }
            },
            {
                title: '被推荐人姓名', key: 'InvitedName',
                render: (text, record) => record.InvitedName || record.InvitedCallName || record.InvitedNickName
            },
            // {title: '推荐人手机号', dataIndex: 'InvitePhone'},
            {
                title: '手机号码', key: 'InvitedPhone',
                render: (text, record) => {
                    return DataTransfer.phone(record.InvitedPhone);
                }
            },
            {
                title: '是否入职', key: 'EnrolState',
                render: (text, record) => {
                    let s_s = 'color-success';
                    if (record.EnrolState === 1) s_s = 'color-danger';
                    return (<span className={s_s}>{this.eEnrolState[record.EnrolState] || ''}</span>);
                }
            },
            {
                title: '是否申请', key: 'ApplyStatus',
                render: (text, record) => {
                    let s_s = 'color-success';
                    if (record.ApplyStatus === 0) s_s = 'color-danger';
                    return (<span className={s_s}>{this.eApplyStatus[record.ApplyStatus] || ''}</span>);
                }
            },
            {
                title: '财务处理', key: 'FinanceDisposingState',
                render: (text, record) => {
                    let s_s = 'color-success';
                    if (record.FinanceDisposingState === 1) s_s = 'color-danger';
                    return (
                        <span className={s_s}>{this.eFinanceDisposingState[record.FinanceDisposingState] || ''}</span>);
                }
            },
            {
                title: '作废原因', dataIndex: 'Remark'
            },
            {
                title: '推荐日期', key: 'InviteDate',
                render: (text, record) => record.InviteDate && moment(record.InviteDate).isValid() ? moment(record.InviteDate).format('YYYY/MM/DD') : ''
            }
        ];
    }
}
