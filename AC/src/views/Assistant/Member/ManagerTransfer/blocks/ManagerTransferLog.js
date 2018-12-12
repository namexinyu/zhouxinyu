import React from 'react';
import {Card, Row, Col, Button, Table} from 'antd';
import SearchFrom from "COMPONENT/SearchForm/index";
import setParams from "ACTION/setParams";
import moment from 'moment';
// 业务相关
import ManagerTransferAction from 'ACTION/Assistant/ManagerTransferAction';

export default class ManagerTransferLog extends React.PureComponent {
    constructor(props) {
        super(props);
        this.eSourceType = {
            1: '经纪人申请',
            2: '助理转人',
            3: '会员主动更换',
            4: '会员认证',
            5: '集散刷机',
            6: '服务超时',
            7: '申请资源'
        };
        this.formItems = [
            {
                name: 'RangeDate',
                label: "划转日期",
                itemType: 'RangePicker',
                placeholder: ['开始日期', '截止日期']
            },
            {name: 'Name', label: "姓名", itemType: 'Input', placeholder: '输入姓名'},
            // {name: 'IDCardNum', label: "身份证号", itemType: 'Input', placeholder: '输入身份证'},
            {name: 'Mobile', label: "手机号", itemType: 'Input', placeholder: '输入手机号'},
            {name: 'Broker', label: "新经纪人", itemType: 'Input', placeholder: '输入工号'},
            {name: 'OldBroker', label: "原经纪人", itemType: 'Input', placeholder: '输入工号'},
            {
                name: 'Operator',
                label: "操作人员",
                itemType: 'AutoCompleteInput',
                valueKey: 'EmployeeID',
                textKey: 'LoginName',
                dataArray: "EmployeeSimpleList",
                placeholder: '选择操作人员'
            }, {
                name: "SourceType",
                label: "划转类型",
                itemType: "Select",
                type: "enum",
                enum: this.eSourceType
            }
        ];
    }

    componentWillMount() {
        let location = this.props.location;
        if (location.lastKey !== location.key && !(location.state && location.state.clickTab)) {
            this.doQuery(this.props.list);
            ManagerTransferAction.mtGetEmployeeSimpleList();
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
            RecordSize: data.pageParam.pageSize
        };
        Object.keys(data.queryParams).forEach((key) => {
            param[key] = data.queryParams[key].value;
        });
        if (param.RangeDate && param.RangeDate.length == 2) {
            param.BeginDate = param.RangeDate[0] && moment(param.RangeDate[0]).isValid() ? param.RangeDate[0].format('YYYY-MM-DD 00:00:00') : '';
            param.EndDate = param.RangeDate[1] && moment(param.RangeDate[1]).isValid() ? param.RangeDate[1].format('YYYY-MM-DD 23:59:59') : '';
        } else {
            param.BeginDate = '';
            param.EndDate = '';
        }
        param.SourceType = param.SourceType - 0;
        delete param.RangeDate;
        param.OpEmployeeId = param.Operator && param.Operator.value ? param.Operator.value - 0 : 0;
        delete param.Operator;
        ManagerTransferAction.mtGetTransferLogList(param);
    }

    render() {
        let data = this.props.list;
        return (
            <div>
                <div className="ivy-page-title">
                    <h1>转人日志</h1>
                </div>
                <div className="container-fluid">
                    <div className="container bg-white mt-20">
                        <SearchFrom handleSearch={() => this.handleSearch()}
                                    dataSource={{EmployeeSimpleList: data.EmployeeSimpleList}}
                                    queryParams={data.queryParams}
                                    state_name={data.state_name}
                                    formItems={this.formItems}/>
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
                                   showTotal: (total, range) => `第${range[0]}-${range[1]}条 共${total}条`
                               }}></Table>
                    </div>
                </div>
            </div>);
    }

    tableColumns() {
        return [
            {title: '姓名', dataIndex: 'Name'},
            // {title: '身份证', dataIndex: 'IDCardNum'},
            {title: '手机号码', dataIndex: 'Mobile'},
            {title: '新经纪人', dataIndex: 'Broker'},
            {title: '旧经纪人', dataIndex: 'OldBroker'},
            {
                title: '划转类型', key: 'SourceType',
                render: (text, record) => this.eSourceType[record.SourceType] || ''
            },
            {title: '备注', dataIndex: 'Remark'},
            {title: '操作人', dataIndex: 'OpEmployee'},
            {
                title: '划转时间', key: 'OpTime',
                render: (text, record) => record.OpTime && moment(record.OpTime).isValid() ? moment(record.OpTime).format('YYYY/MM/DD HH:mm:ss') : ''
            }
        ];
    }
}