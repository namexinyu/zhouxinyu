import React from 'react';
import {Card, Row, Col, Button, Table} from 'antd';
import SearchFrom from "COMPONENT/SearchForm/index";
import setParams from "ACTION/setParams";
import moment from 'moment';
// 业务相关
import Mapping_Audit from 'CONFIG/EnumerateLib/Mapping_Audit';
import AuditListAction from 'ACTION/Audit/AuditListAction';
import IDCardModal from './IDCardModal';


export default class IDCardContainer extends React.PureComponent {
    constructor(props) {
        super(props);
        this.eReason = {...Mapping_Audit.eIDCardReason};
        this.eAuditStatus = {...Mapping_Audit.eAuditStatus};
        this.eResource = {...Mapping_Audit.eCertSource};
        this.eType = {...Mapping_Audit.eCardPicType};
        // this.eEnableStatus = {
        //     0: '未知',
        //     1: '可用',
        //     2: '不可用'
        // };

        this.formItems = [
            {name: 'UploadTimeBegin', label: "开始日期", itemType: 'DatePicker', placeholder: '开始日期'},
            {name: 'UploadTimeEnd', label: "截止日期", itemType: 'DatePicker', placeholder: '截止日期'},
            {name: 'RealName', label: "姓名", itemType: 'Input', placeholder: '输入姓名'},
            {name: 'IDCardNum', label: "身份证号", itemType: 'Input', placeholder: '输入身份证'},
            {name: 'Mobile', label: "手机号", itemType: 'Input', placeholder: '输入手机号'},
            {
                name: 'AuditStatus',
                label: "审核状态",
                itemType: 'Select',
                type: 'enum',
                enum: this.eAuditStatus
            },
            {
                name: 'CardPicType',
                label: "类型",
                itemType: 'Select',
                type: 'enum',
                enum: this.eType
            },
            {
                name: 'CertSource',
                label: "来源",
                itemType: 'Select',
                type: 'enum',
                enum: this.eResource
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
            if (['AuditStatus', 'CardPicType', 'CertSource'].indexOf(key) != -1) {
                param[key] = item.value - 0;
            } else {
                param[key] = item.value;
            }
        }
        param.UploadTimeBegin = param.UploadTimeBegin ? param.UploadTimeBegin.format("YYYY-MM-DD") : '';
        param.UploadTimeEnd = param.UploadTimeEnd ? param.UploadTimeEnd.format("YYYY-MM-DD") : '';
        AuditListAction.getIDCardList(param);
    }

    handleOpenModal(record, e) {
        setParams(this.props.detail.state_name, {ID: record.CertFlowID});
    }

    render() {
        let data = this.props.list;
        return (
            <div>
                <div className="ivy-page-title">
                    <h1>身份证审核</h1>
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
                {this.props.detail.ID != undefined && this.props.detail.ID != null ?
                    <IDCardModal detail={this.props.detail}/> : ''}
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
                title: '上传时间', key: 'UploadTime',
                render: (text, record) => record.UploadTime && moment(record.UploadTime).isValid() ? moment(record.UploadTime).format('MM/DD HH:mm') : ''
            },
            {
                title: '来源', key: 'CertSource',
                render: (text, record) => this.eResource[record.CertSource] ? this.eResource[record.CertSource] : ''
            },
            {title: '姓名', dataIndex: 'RealName'},
            {
                title: '身份证', key: 'IDCardNum',
                render: (text, record) => {
                    if (record.AuditStatus == 3) {
                        return <a onClick={this.handleOpenModal.bind(this, record)}>{record.IDCardNum}</a>;
                    } else if (record.AuditStatus == 4) {
                        return <a onClick={this.handleOpenModal.bind(this, record)}>查看</a>;
                    } else if (record.AuditStatus == 1) {
                        return <a onClick={this.handleOpenModal.bind(this, record)}>审核</a>;
                    }
                    return record.IDCardNum;
                }
            },
            {
                title: '类型', key: 'CardPicType',
                render: (text, record) => this.eType[record.CardPicType] ? this.eType[record.CardPicType] : ''
            },
            {title: '手机号码', dataIndex: 'Mobile'},
            {
                title: '审核状态', key: 'AuditStatus',
                render: (text, record) => this.eAuditStatus[record.AuditStatus] ? this.eAuditStatus[record.AuditStatus] : ''
            },
            {title: '审核人', dataIndex: 'AuditEmployee'},
            {
                title: '审核时间', key: 'AuditTime',
                render: (text, record) => record.AuditTime && moment(record.AuditTime).isValid() ? moment(record.AuditTime).format('MM/DD HH:mm') : ''
            },
            {
                title: '备注', key: 'CertAuditFailReason',
                render: (text, record) => this.eReason[record.CertAuditFailReason] ? this.eReason[record.CertAuditFailReason] : ''
            }
        ];
    }
}