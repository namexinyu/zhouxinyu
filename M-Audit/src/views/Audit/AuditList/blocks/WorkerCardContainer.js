import React from 'react';
import {Card, Row, Col, Button, Table} from 'antd';
import SearchFrom from "COMPONENT/SearchForm/index";
import setParams from "ACTION/setParams";
import moment from 'moment';
// 业务相关
import Mapping_Audit from 'CONFIG/EnumerateLib/Mapping_Audit';
import AuditListAction from 'ACTION/Audit/AuditListAction';
import CommonAction from 'ACTION/Audit/Common/index';
import WorkerCardModal from './WorkerCardModal';

export default class WorkerCardContainer extends React.PureComponent {
    constructor(props) {
        super(props);
        this.eReason = {...Mapping_Audit.eWorkCardReason};
        this.eAuditStatus = {...Mapping_Audit.eAuditStatus};
        this.eResource = {...Mapping_Audit.eCertSource};
        this.eType = {...Mapping_Audit.eCardPicType};
        // this.eEnableStatus = {
        //     0: '未知',
        //     1: '可用',
        //     2: '不可用'
        // };
        this.formItems = [
            {name: 'StartDate', label: "开始日期", itemType: 'DatePicker', placeholder: '开始日期'},
            {name: 'StopDate', label: "截止日期", itemType: 'DatePicker', placeholder: '截止日期'},
            {name: 'UserName', label: "姓名", itemType: 'Input', placeholder: '输入姓名'},
            {name: 'IDCardNum', label: "身份证号", itemType: 'Input', placeholder: '输入身份证'},
            {
                name: 'Enterprise',
                label: "企业名称",
                itemType: 'AutoCompleteInput',
                valueKey: 'EntID',
                textKey: 'ShortName',
                dataArray: 'EnterpriseSimpleList',
                placeholder: '输入企业名称'
            },
            {name: 'JobNum', label: "工号", itemType: 'Input', placeholder: '输入工号'},
            {
                name: 'AuditStatus',
                label: "审核状态",
                itemType: 'Select',
                type: 'enum',
                enum: this.eAuditStatus
            },
            {name: 'Mobile', label: '手机号', itemType: 'Input', placeholder: '输入手机号码'}
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
        // 弹窗关闭时刷新列表
        if (nextProps.detail.ID !== this.props.detail.ID && !nextProps.detail.ID) {
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

    doQuery(data) {
        let param = {
            RecordIndex: data.pageParam.pageSize * (data.pageParam.currentPage - 1),
            RecordSize: data.pageParam.pageSize
        };
        for (let key of Object.keys(data.queryParams)) {
            const item = data.queryParams[key];
            if (['AuditStatus'].indexOf(key) != -1) {
                param[key] = item.value - 0;
            } else {
                param[key] = item.value;
            }
        }
        if (param.Enterprise) {
            if (param.Enterprise.value) {
                param.EntID = param.Enterprise.value - 0;
            } else {
                param.EntID = -9999;
            }
        }
        delete param.Enterprise;
        param.StartDate = param.StartDate ? param.StartDate.format("YYYY-MM-DD") : '';
        param.StopDate = param.StopDate ? param.StopDate.format("YYYY-MM-DD") : '';
        AuditListAction.getWorkCardList(param);
    }

    handleOpenModal(record, e) {
        setParams(this.props.detail.state_name, {ID: record.WorkCardFlowID});
    }

    render() {
        let data = this.props.list;
        return (
            <div>
                <div className="ivy-page-title">
                    <h1>工牌审核</h1>
                </div>
                <div className="container-fluid mt-16">
                    <Card bordered={false}>
                        <SearchFrom handleSearch={() => this.handleSearch()}
                                    dataSource={{EnterpriseSimpleList: this.props.EnterpriseSimpleList}}
                                    queryParams={data.queryParams}
                                    state_name={data.state_name}
                                    formItems={this.formItems}/>
                        <Table columns={this.tableColumns()}
                               rowKey={(record, index) => index}
                               dataSource={data.RecordList}
                               loading={data.RecordListLoading}
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
                                   showTotal: (total, range) => `第${range[0]}-${range[1]}条 共${total}条`
                               }}></Table>
                    </Card>
                </div>
                {this.props.detail.ID != undefined && this.props.detail != null ?
                    <WorkerCardModal detail={this.props.detail}/> : ''}
            </div>);
    }

    tableColumns() {
        return [
            {
                title: '编号', key: 'rowKey',
                render: (text, record, index) => index + 1
            },
            {
                title: '上传时间', key: 'CreateTime',
                render: (text, record) => record.CreateTime && moment(record.CreateTime).isValid() ? moment(record.CreateTime).format('MM/DD HH:mm') : ''
            },
            {title: '姓名', dataIndex: 'UserName'},
            {title: '身份证', dataIndex: 'IDCardNum'},
            {title: '手机号码', dataIndex: 'Mobile'},
            {
                title: '企业名称', key: 'EntName',
                render: (text, record) => {
                    if (record.AuditStatus == 3) {
                        return <a onClick={this.handleOpenModal.bind(this, record)}>{record.EntName}</a>;
                    } else if (record.AuditStatus == 4) {
                        return <a onClick={this.handleOpenModal.bind(this, record)}>查看</a>;
                    } else if (record.AuditStatus == 1) {
                        // 不在面试名单时，不可审核
                        return <a disabled={record.Whether == 0}
                                  onClick={this.handleOpenModal.bind(this, record)}>审核</a>;
                    }
                    return record.EntName;
                }
            },
            {
                title: '工号', key: 'JobNum',
                render: (text, record) => {
                    if (record.AuditStatus == 3) {
                        return <a onClick={this.handleOpenModal.bind(this, record)}>{record.JobNum}</a>;
                    } else if (record.AuditStatus == 4) {
                        return <a onClick={this.handleOpenModal.bind(this, record)}>查看</a>;
                    } else if (record.AuditStatus == 1) {
                        return <a disabled={record.Whether == 0}
                                  onClick={this.handleOpenModal.bind(this, record)}>审核</a>;
                    }
                    return record.JobNum;
                }
            },
            {
                title: '审核状态', key: 'AuditStatus',
                render: (text, record) => this.eAuditStatus[record.AuditStatus] ? this.eAuditStatus[record.AuditStatus] : ''
            },
            {title: '审核人', dataIndex: 'AuditPerson'},
            {
                title: '审核时间', key: 'AuditTime',
                render: (text, record) => record.AuditTime && moment(record.AuditTime).isValid() ? moment(record.AuditTime).format('MM/DD HH:mm') : ''
            },
            {
                title: '备注', key: 'WCAuditFailReason',
                render: (text, record) => this.eReason[record.WCAuditFailReason] ? this.eReason[record.WCAuditFailReason] : ''
            }
        ];
    }
}