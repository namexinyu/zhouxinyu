import React from 'react';
import {Card, Row, Col, Button, Table} from 'antd';
import SearchFrom from "COMPONENT/SearchForm/index";
import setParams from "ACTION/setParams";
import moment from 'moment';
// 业务相关
import Mapping_Audit from 'CONFIG/EnumerateLib/Mapping_Audit';
import AuditListAction from 'ACTION/Audit/AuditListAction';
import BankCardModal from './BankCardModal';
// import CommonAction from 'ACTION/Audit/Common/index';

export default class BankCardContainer extends React.PureComponent {
    constructor(props) {
        super(props);
        this.eReason = {...Mapping_Audit.eBankCardReason};
        this.eAuditStatus = {...Mapping_Audit.eAuditStatus};
        this.eResource = {...Mapping_Audit.eCertSource};
        this.eType = {...Mapping_Audit.eCardPicType};
        // this.eEnableStatus = {...Mapping_Audit.eCardPicType};
        this.formItems = [
            {name: 'DateBegin', label: "开始日期", itemType: 'DatePicker', placeholder: '开始日期'},
            {name: 'DateEnd', label: "截止日期", itemType: 'DatePicker', placeholder: '截止日期'},
            {name: 'RealName', label: "姓名", itemType: 'Input', placeholder: '输入姓名'},
            {name: 'IDCardNum', label: "身份证号", itemType: 'Input', placeholder: '输入身份证'},
            {name: 'AccountNum', label: "银行卡号", itemType: 'Input', placeholder: '输入银行卡号'},
            {
                name: 'AuditStatus',
                label: "审核状态",
                itemType: 'Select',
                type: 'enum',
                enum: this.eAuditStatus
            },
            // {
            //     name: 'EnableStatus',
            //     label: "是否可用",
            //     itemType: 'Select',
            //     type: 'enum',
            //     enum: this.eEnableStatus
            // },
            {
                name: 'IsOCR',
                label: "类型",
                itemType: 'Select',
                type: 'enum',
                enum: this.eType
            },
            {name: 'Mobile', label: '手机号', itemType: 'Input', placeholder: '输入手机号码'}
        ];

    }

    componentWillMount() {
        let location = this.props.location;
        // CommonAction.getBankFilterList();
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
            SequenceCreateTime: 1, // 升序
            RecordIndex: data.pageParam.pageSize * (data.pageParam.currentPage - 1),
            RecordSize: data.pageParam.pageSize
        };
        for (let key of Object.keys(data.queryParams)) {
            const item = data.queryParams[key];
            if (['AuditStatus', 'IsOCR'].indexOf(key) != -1) {
                param[key] = item.value - 0;
            } else {
                param[key] = item.value;
            }
        }
        param.DateBegin = param.DateBegin ? param.DateBegin.format("YYYY-MM-DD") : '';
        param.DateEnd = param.DateEnd ? param.DateEnd.format("YYYY-MM-DD") : '';
        AuditListAction.getBankCardList(param);
    }

    handleOpenModal(record, e) {
        setParams(this.props.detail.state_name, {ID: record.AuditFlowID});
    }

    render() {
        let data = this.props.list;
        return (
            <div>
                <div className="ivy-page-title">
                    <h1>银行卡审核</h1>
                </div>
                <div className="container-fluid mt-16">
                    <Card bordered={false}>
                        <SearchFrom handleSearch={() => this.handleSearch()}
                                    dataSource={{}}
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
                {this.props.detail.ID != null && this.props.detail.ID != undefined ?
                    <BankCardModal detail={this.props.detail} bankFilterList={this.props.bankFilterList}/> : ''}
            </div>);
    }

    tableColumns() {
        let data = this.props.list;
        let RecordIndex = data.pageParam.pageSize * (data.pageParam.currentPage - 1);
        return [
            {
                title: '编号', key: 'rowKey',
                render: (text, record, index) => RecordIndex + index + 1
            },
            {
                title: '上传时间', key: 'CreateTime',
                render: (text, record) => record.CreateTime && moment(record.CreateTime).isValid() ? moment(record.CreateTime).format('MM/DD HH:mm') : ''
            },
            {title: '姓名', dataIndex: 'RealName'},
            {title: '身份证', dataIndex: 'IDCardNum'},
            {title: '手机号码', dataIndex: 'Mobile'},
            {
                title: '银行卡号', key: 'AccountNum',
                render: (text, record) => {
                    if (record.AuditStatus == 3) {
                        return <a onClick={this.handleOpenModal.bind(this, record)}>{record.AccountNum}</a>;
                    } else if (record.AuditStatus == 4) {
                        return <a onClick={this.handleOpenModal.bind(this, record)}>查看</a>;
                    } else if (record.AuditStatus == 1) {
                        return <a disabled={record.IDCardAuditStatus != 3}
                                  onClick={this.handleOpenModal.bind(this, record)}>审核</a>;
                    }
                    return record.AccountNum;
                }
            },
            {
                title: '银行名称', key: 'BankName',
                render: (text, record) => {
                    if (record.AuditStatus == 3) {
                        return <a onClick={this.handleOpenModal.bind(this, record)}>{record.BankName}</a>;
                    } else if (record.AuditStatus == 4) {
                        return <a onClick={this.handleOpenModal.bind(this, record)}>查看</a>;
                    } else if (record.AuditStatus == 1) {
                        return <a disabled={record.IDCardAuditStatus != 3}
                                  onClick={this.handleOpenModal.bind(this, record)}>审核</a>;
                    }
                    return record.BankName;
                }
            },
            {
                title: '类型', key: 'IsOCR',
                render: (text, record) => this.eType[record.IsOCR] ? this.eType[record.IsOCR] : ''
            },
            {title: '审核人', dataIndex: 'AuditEmployee'},
            {
                title: '审核时间', key: 'AuditTime',
                render: (text, record) => record.AuditTime && moment(record.AuditTime).isValid() ? moment(record.AuditTime).format('MM/DD HH:mm') : ''
            },
            {
                title: '审核状态', key: 'AuditStatus',
                render: (text, record) => this.eAuditStatus[record.AuditStatus] ? this.eAuditStatus[record.AuditStatus] : ''
            },
            {
                title: '备注', key: 'Remarks',
                render: (text, record) => this.eReason[record.Remarks] ? this.eReason[record.Remarks] : ''
            }
        ];
    }
}