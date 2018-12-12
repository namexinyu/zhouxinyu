import QueryListPage from 'COMPONENT/QueryListPage/index';
import React from 'react';
import {Icon, Alert, message} from 'antd';
import moment from 'moment';
import AppSessionStorage from "CONFIG/SessionStorage/AppSessionStorage";
import {DataTransfer, ParamTransfer} from 'UTIL/base/CommonUtils';
import setParams from "ACTION/setParams";
// 业务相关
import BillAction from 'ACTION/ExpCenter/BillAction';
import BillEditModal from './BillEditModal';
import "LESS/components/alert-container.less";


export default class BillList extends QueryListPage {
    constructor(props) {
        const isManager = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('role').indexOf("HubManager") != -1;
        const authHubList = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('HubList') || [];
        const eHub = authHubList.reduce((obj, v) => Object.assign(obj, {[v.HubID]: v.HubName}), {});
        const formItemsList = [
            {
                name: 'BillDate',
                label: "交账日期",
                itemType: 'DatePicker',
                initValue: moment()
            }
        ];
        if (isManager) {
            formItemsList.push({
                name: 'HubID',
                label: '体验中心',
                itemType: 'Select',
                type: 'enum',
                enum: eHub,
                initValue: '-9999'
            });
        }
        super(props, formItemsList);
        this.eCommitStatus = {
            1: '未提交',
            2: '已提交'
        };
        this.eAuditStatus = {
            1: '待审核',
            2: '通过',
            3: '拒绝'
        };
        this.title = "每日交账";
    }

    doMount() {
    }

    // handleConcatOrderParam(d) {
    //     return {AscDesc: d.orderParams};
    // }

    handleCreateParam(d) {
        let param = this.transferParam(d);
        param.BillDate = ParamTransfer.date(param.BillDate, moment(), 'YYYY-MM-DD');
        let HubIDList = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('HubIDList');
        if (param.HubID && param.HubID != -9999) HubIDList = [param.HubID - 0];
        param.HubIDList = HubIDList;
        delete param.HubID;
        return param;
    }

    sendQuery(param) {
        BillAction.getBillList(param);
    }

    // handleTableChange(pagination, filters, sorter) {
    //     if (sorter) {
    //         if (sorter.columnKey == 'CheckinTime') {
    //             let s_s = sorter.order == 'ascend' ? 1 : 0;
    //             if (this.props.list.orderParams != s_s) {
    //                 setParams(this.props.list.state_name, {orderParams: s_s});
    //             }
    //         }
    //     }
    // }

    handleRowClick(record) {
        const data = this.props.list;
        if (record.AuditStatus !== 2) {
            setParams(data.state_name, {curDataRecord: {...record}});
        } else {
            message.destroy();
            message.info('已审核通过，无法修改');
        }
    }

    extraComponent() {
        const data = this.props.list;
        const {
            TotalAmount, TotalAmountReal, TotalRefundAmount, TotalRefundAmountReal,
            TotalPayWeiXin, TotalPayCash, TotalPayBank, TotalPayAliPay, TotalBalance
        } = data.Total;
        return (
            <div className="alert-container mb-16">
                <div className="alert-text">
                    {`总计：应收 ${DataTransfer.money(TotalAmount, 2)} 元,
                  实收 ${DataTransfer.money(TotalAmountReal, 2)} 元,
                  已退 ${DataTransfer.money(TotalRefundAmount, 2)} 元,
                  实退 ${DataTransfer.money(TotalRefundAmountReal, 2)} 元。
                `}<br/>
                    {`
                    总计：微信 ${DataTransfer.money(TotalPayWeiXin, 2)} 元,
                    支付宝 ${DataTransfer.money(TotalPayAliPay, 2)} 元,
                    现金 ${DataTransfer.money(TotalPayCash, 2)} 元,
                    银行转账 ${DataTransfer.money(TotalPayBank, 2)} 元,
                    差额 ${DataTransfer.money(TotalBalance, 2)} 元
                    `}
                </div>
                {data.curDataRecord ?
                    <BillEditModal
                        onModalClose={() => {
                            setParams(data.state_name, {curDataRecord: undefined});
                            this.doQuery();
                        }}
                        {...data.curDataRecord}/> : ''}
            </div>
        );
    }

    tableColumns(orderParams) {
        const data = this.props.list;
        return [
            {
                title: '交账日期', key: 'BillDate',
                render: (text, record) => DataTransfer.date(record.BillDate)
            },
            {
                title: '体验中心', dataIndex: 'HubName'
            },
            {
                title: (<div className="color-danger">应收</div>), key: 'Amount',
                render: (text, record) => record.Amount ? DataTransfer.money(record.Amount, 2) : ''
            },
            {
                title: '实收', key: 'AmountReal',
                render: (text, record) => record.CommitStatus == 2 || record.AmountReal ? DataTransfer.money(record.AmountReal, 2) : ''
            },
            {
                title: (<div className="color-danger">已退</div>), key: 'RefundAmount',
                render: (text, record) => record.RefundAmount ? DataTransfer.money(record.RefundAmount, 2) : ''
            },
            {
                title: '实退', key: 'RefundAmountReal',
                render: (text, record) => record.CommitStatus == 2 || record.RefundAmountReal ? DataTransfer.money(record.RefundAmountReal, 2) : ''
            },
            {
                title: '收款存入公司方式',
                children: [
                    {
                        title: '微信', key: 'PayWeiXin',
                        render: (text, record) => record.CommitStatus == 2 || record.PayWeiXin ? DataTransfer.money(record.PayWeiXin, 2) : ''
                    },
                    {
                        title: '支付宝', key: 'PayAliPay',
                        render: (text, record) => record.CommitStatus == 2 || record.PayAliPay ? DataTransfer.money(record.PayAliPay, 2) : ''
                    },
                    {
                        title: '现金', key: 'PayCash',
                        render: (text, record) => record.CommitStatus == 2 || record.PayCash ? DataTransfer.money(record.PayCash, 2) : ''
                    },
                    {
                        title: '银行转帐', key: 'PayBank',
                        render: (text, record) => record.CommitStatus == 2 || record.PayBank ? DataTransfer.money(record.PayBank, 2) : ''
                    },
                    {
                        title: '差额', key: 'Balance',
                        render: (text, record) => record.CommitStatus == 2 || record.Balance ? DataTransfer.money(record.Balance, 2) : ''
                    }
                ]
            },
            {
                title: '提交状态', key: 'CommitStatus',
                render: (text, record) => {
                    let s_s = 'color-danger';
                    if (record.CommitStatus === 2) s_s = 'color-success';
                    return (<div className={s_s}>
                        {this.eCommitStatus[record.CommitStatus] || '未提交'}
                    </div>);
                }
            },
            {
                title: '审核状态', key: 'AuditStatus',
                render: (text, record) => {
                    let s_s = '';
                    if (record.AuditStatus === 1) s_s = 'color-orange';
                    else if (record.AuditStatus === 2) s_s = 'color-success';
                    else if (record.AuditStatus === 3) s_s = 'color-danger';
                    return (<div className={s_s}>
                        {this.eAuditStatus[record.AuditStatus] || ''}
                    </div>);
                }
            },
            {
                title: '拒绝原因', dataIndex: 'AuditReason'
            },
            {
                title: '审核人', dataIndex: 'AuditUserName'
            }
        ];
    }
}