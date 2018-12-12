import QueryListPage from 'COMPONENT/QueryListPage/index';
import {Icon, Button, Row, message} from 'antd';
import ActionMAMSRecruitment from 'ACTION/Common/Recruitment/ActionMAMSRecruitment';
import moment from 'moment';
import React from 'react';
// 业务相关
import PerformanceAction from 'ACTION/Broker/Performance/PerformanceAction';
import PerformanceService from 'SERVICE/Broker/PerformanceService';
import setParams from "ACTION/setParams";
import PerformanceDetailModal from './PerformanceDetailModal';
import AppSessionStorage from "CONFIG/SessionStorage/AppSessionStorage";
import PerformanceQueryModal from './PerformanceQueryModal';


export default class PerformanceList extends QueryListPage {
    constructor(props) {
        const DepartmentOptions = [{value: -9999, label: '全部'}, {
            value: 1000,
            label: '一部',
            children: [{
                value: 1100,
                label: '火凤凰队'
            }]
        }];
        const formItemsList = [
            {
                name: 'SettleMonth',
                label: "薪资日期",
                itemType: 'MonthPicker',
                placeholder: '选择月份',
                initValue: moment()
            }
        ];
        super(props, formItemsList);
        this.eTuhao = {
            0: '否',
            1: '是'
        };
        this.title = "绩效查询";
        this.state = {
            isExporting: false
        };
        this.handleExport = this.handleExport.bind(this);
    }

    handleConcatOrderParam(d) {
        return {OrderBy: d.orderParams};
    }

    handleCreateParam(d) {
        let param = this.transferParam(d);
        param.BrokerNo = '';
        param.BrokerName = '';
        param.BrokerID = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('');
        param.GroupID = 0;
        param.DepartID = 0;
        console.log('param', param);
        if (param.SettleMonth && moment(param.SettleMonth).isValid()) {
            param.SettleMonth = moment(param.SettleMonth).format("YYYY-MM");
        } else {
            param.SettleMonth = moment().format("YYYY-MM");
        }
        // if (/^\d{4,6}$/.test(param.Broker)) {
        //     param.BrokerNo = param.Broker;
        // } else if (param.Broker) {
        //     param.BrokerName = param.Broker;
        // }
        // delete param.Broker;
        param.OrderBy = d.orderParams;
        return param;
        // this.oriParamJson = JSON.stringify(param);
        // PerformanceAction.GetPerformanceList(param);
    }

    sendQuery(param) {
        PerformanceAction.GetPerformanceList(param);
    }

    handleShowDetail(record, type) {
        let detail = this.props.detail;
        let param = {
            BrokerID: record.BrokerID,
            SettleMonth: record.SettleMonth
        };
        setParams(detail.state_name, {Param: param, type: type});
    }

    handleExport() {
        this.setState({isExporting: true});
        if (this.oriParamJson) {
            // console.log('handleExport', this.oriParamJson);
            let ex_param = JSON.parse(this.oriParamJson);
            // console.log('handleExport', ex_param);
            delete ex_param.RecordIndex;
            delete ex_param.RecordSize;
            PerformanceService.ExportPerformanceData(ex_param).then((res) => {
                // console.log('handleExport', res);
                this.setState({isExporting: false});
                if (res && !res.error && res.Data && res.Data.FileUrl) {
                    message.destroy();
                    message.info('导出成功');
                    window.open(res.Data.FileUrl, '_blank');
                }
            }, (err) => {
                // console.log(err);
                this.setState({isExporting: false});
                message.destroy();
                message.info('导出异常' + err && err.Desc ? ':' + err.Desc : '');
            });
        }
    }

    extraComponent() {
        let modal = '';
        let data = this.props.list;
        let detail = this.props.detail;
        if (this.props.detail.Param && this.props.detail.type === 'detail') {
            modal = <PerformanceDetailModal {...this.props.detail}/>;
        } else if (this.props.detail.Param && this.props.detail.type === 'query') {
            modal = <PerformanceQueryModal Param={this.props.detail.Param}
                                           list={this.props.detail.listBJS}
                                           queryParams={this.props.detail.queryParams}
                                           state_name={this.props.detail.state_name}/>;
        } else {
            modal = '';
        }
        return (<Row className="mb-8">
            {modal}
           {/* <Button type="primary" disabled={!this.oriParamJson} loading={this.state.isExporting}
                    onClick={this.handleExport}>绩效导出</Button>*/}
        </Row>);
    }

    handleTableChange(pagination, filters, sorter) {
        if (sorter && sorter.columnKey) {
            if (sorter.columnKey == 'Bonus') {
                let s_s = sorter.order == 'ascend' ? 1 : 2;
                if (this.props.list.orderParams != s_s) {
                    setParams(this.props.list.state_name, {orderParams: s_s});
                }
            } else if (sorter.columnKey == 'Counter') {
                let s_s = sorter.order == 'ascend' ? 3 : 4;
                if (this.props.list.orderParams != s_s) {
                    setParams(this.props.list.state_name, {orderParams: s_s});
                }
            }
        }
    }

    tableColumns(orderParams) {
        return [
            {title: '工号', dataIndex: 'BrokerNo'},
            {title: '昵称', dataIndex: 'NickName'},
            {title: '组别', dataIndex: 'Group'},
            {
                title: '绩效榜人数', dataIndex: 'Counter',
                sorter: true,
                sortOrder: orderParams === 3 ? "ascend" : (orderParams === 4 ? "descend" : false)
            },
            {title: '土豪', key: 'Tuhao', render: (text, record) => this.eTuhao[record.Tuhao] || ''},
            {
                title: '总绩效(元)',
                key: 'Bonus',
                sorter: true,
                sortOrder: orderParams === 1 ? "ascend" : (orderParams === 2 ? "descend" : false),
                render: (text, record) => ((record.Bonus || 0) / 100).FormatMoney({fixed: 2})
            },
            {
                title: '我打当月绩效(去重)',
                children: [
                    {title: '绩效名单', dataIndex: 'CurrCounterWoda'},
                    {title: '上月转结人数', dataIndex: 'PreCounterWoda'},
                    {
                        title: '绩效(元)',
                        key: 'AmountWoda',
                        render: (text, record) => ((record.AmountWoda || 0) / 100).FormatMoney({fixed: 2})
                    }
                ]
            },
            {
                title: '周薪薪当月绩效(去重)',
                children: [
                    {title: '绩效名单', dataIndex: 'CurrCounterZXX'},
                    {title: '上月转结人数', dataIndex: 'PreCounterZXX'},
                    {title: '<=90天总数', dataIndex: 'CounterLessZXX'},
                    {title: '90<在职<=150天总数', dataIndex: 'CounterBigZXX'},
                    {
                        title: '绩效(元)',
                        key: 'AmountZXX',
                        render: (text, record) => ((record.AmountZXX || 0) / 100).FormatMoney({fixed: 2})
                    }
                ]
            },
            {
                title: '绩效详情', key: 'Operate',
                width: 150,
                render: (text, record) => {
                    return (
                        <div>
                            <Button onClick={() => this.handleShowDetail(record, 'detail')} type="primary"
                                    className="mr-8" ghost>详情</Button>
                            <Button onClick={() => this.handleShowDetail(record, 'query')} type="primary"
                                    ghost>查询</Button>
                        </div>
                    );
                }
            }
        ];
    }
}