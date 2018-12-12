import React from 'react';
import {Card, Row, Col, Button, Table} from 'antd';
import SearchFrom from "COMPONENT/SearchForm/index";
import setParams from "ACTION/setParams";
import moment from 'moment';
import {RegexRule, Constant} from 'UTIL/constant/index';
// 业务相关
import TransferApplyAction from 'ACTION/Broker/TransferApply/TransferApplyAction';
import TransferApplyModal from './TransferApplyModal';

export default class TransferList extends React.PureComponent {
    constructor(props) {
        super(props);
        this.eApplyResult = {
            1: '通过',
            2: '不通过'
        };
        // 1 半年内有入职不转 2 10天内有联系记录不转 3 30分钟内注册不转 4 当天刷过身份证不转
        this.eFailReason = {
            1: '两个月内有签到不转',
            2: '10天内有联系记录不转',
            3: '30分钟内注册不转',
            4: '当天刷过身份证不转',
            5: '对方核心资源'
        };
        this.formItems = [
            {
                name: 'RangeDate',
                label: "申请日期",
                itemType: 'RangePicker',
                placeholder: ['开始日期', '截止日期']
            },
            // {name: 'BrokerNum', label: "申请人", itemType: 'Input', placeholder: '输入工号'},
            {name: 'Name', label: "会员姓名", itemType: 'Input', placeholder: '输入姓名'},
            {name: 'Mobile', label: "手机号", itemType: 'Input', placeholder: '输入手机号'},
            {
                name: 'ApplyResult',
                label: "申请结果",
                itemType: 'Select',
                type: 'enum',
                enum: this.eApplyResult
            }
        ];
        this.handleShowModal = this.handleShowModal.bind(this);
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
        // 刷新
        let nextData = nextProps.list;
        let curData = this.props.list;
        if (nextData.CallTransferApplyFetch.status == 'success' && curData.CallTransferApplyFetch.status != 'success') {
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
            RecordSize: data.pageParam.pageSize
        };
        Object.keys(data.queryParams).forEach((key) => {
            if (['ApplyResult'].indexOf(key) != -1) {
                param[key] = data.queryParams[key].value - 0;
            } else {
                param[key] = data.queryParams[key].value;
            }
        });
        if (param.RangeDate && param.RangeDate.length == 2) {
            param.BeginDate = param.RangeDate[0] && moment(param.RangeDate[0]).isValid() ? param.RangeDate[0].format('YYYY-MM-DD 00:00:00') : '';
            param.EndDate = param.RangeDate[1] && moment(param.RangeDate[1]).isValid() ? param.RangeDate[1].format('YYYY-MM-DD 23:59:59') : '';
        } else {
            param.BeginDate = '';
            param.EndDate = '';
        }
        delete param.RangeDate;
        TransferApplyAction.GetTransferApplyList(param);
    }

    handleShowModal() {
        let data = this.props.list;
        setParams(data.state_name, {showModal: true});
    }

    render() {
        let data = this.props.list;
        return (
            <div>
                <div className="ivy-page-title">
                    <h1>转人申请</h1>
                </div>
                <div className="container-fluid">
                    <div className="container bg-white mt-20">
                        <SearchFrom handleSearch={() => this.handleSearch()}
                                    dataSource={{EmployeeSimpleList: data.EmployeeSimpleList}}
                                    queryParams={data.queryParams}
                                    state_name={data.state_name}
                                    formItems={this.formItems}/>
                        <Row className="mt-16 mb-16">
                            <Button type="primary" onClick={this.handleShowModal}>申请转人</Button>
                        </Row>
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
                {data.showModal ? <TransferApplyModal list={this.props.list}/> : ''}
            </div>);
    }

    tableColumns() {
        return [
            {
                title: '序号', key: 'seqNo', width: 42,
                render: (text, record, index) => index + 1
            },
            {title: '姓名', dataIndex: 'Name'},
            // {title: '身份证', dataIndex: 'IDCardNum'},
            {title: '手机号', dataIndex: 'Mobile'},
            // {title: '申请人', dataIndex: 'BrokerNum'},
            {title: '申请原因', dataIndex: 'ApplyReason'},
            {
                title: '申请结果', key: 'ApplyResult',
                render: (text, record) => this.eApplyResult[record.ApplyResult] || ''
            },
            {
                title: '不通过原因', key: 'FailReason',
                render: (text, record) => this.eFailReason[record.FailReason] || ''
            },
            {
                title: '申请时间', key: 'OpTime',
                render: (text, record) => record.OpTime && moment(record.OpTime).isValid() ? moment(record.OpTime).format('YYYY/MM/DD HH:mm:ss') : ''
            }
        ];
    }
}