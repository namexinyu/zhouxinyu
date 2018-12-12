import QueryListPage from 'COMPONENT/QueryListPage/index';
import React from 'react';
import {Icon} from 'antd';
import moment from 'moment';
import AppSessionStorage from "CONFIG/SessionStorage/AppSessionStorage";
import {browserHistory} from 'react-router';
import getHubList from "ACTION/Broker/HubListInfo/HubListInfo";
import getPickupLocationList from 'ACTION/Broker/MemberDetail/getPickupLocationList';
import stateObjs from "VIEW/StateObjects";
// 业务相关
import getSendCarData from 'ACTION/Broker/TodayEstimateSign/SendCar';
import setParams from "ACTION/setParams";
import {DataTransfer, paramTransfer} from 'UTIL/base/CommonUtils';

export default class SendCarNew extends QueryListPage {
    constructor(props) {
        const ePickupMode = {...stateObjs.PickupMode};
        const ePickupStatus = {...stateObjs.PickupStatus};
        const eContactStatus = {...stateObjs.ContactStatus};
        const formItemsList = [
            {name: 'UserName', label: "会员姓名", itemType: 'Input', placeholder: '输入姓名', initValue: ''},
            {name: 'UserMobile', label: "手机号码", itemType: 'Input', placeholder: '输入手机号', initValue: ''},
            {
                name: 'PickupMode',
                label: "派单类型",
                itemType: 'Select',
                type: 'enum',
                enum: ePickupMode,
                initValue: '-9999'
            },
            {
                name: 'PickupStart',
                label: "去哪儿接",
                itemType: 'AutoCompleteInput',
                valueKey: 'LocationID',
                textKey: 'LocationName',
                dataArray: "pickupLocationList",
                initValue: {value: undefined, text: undefined}
            },
            {
                name: 'PickupTargetAddrID',
                label: "往哪儿送",
                itemType: 'Select',
                type: 'list',
                list: 'HubSimpleList',
                optionKey: 'HubID',
                optionValue: 'HubName',
                initValue: '-9999'
            },
            {
                name: 'RangeDate',
                label: "派车日期",
                itemType: 'RangePicker',
                placeholder: ['开始日期', '截止日期'],
                initValue: [undefined, undefined]
            },
            {
                name: 'PickupStatus',
                label: "派车单状态",
                itemType: 'Checkbox',
                enum: ePickupStatus,
                colSpan: 2,
                initValue: []
            }
        ];
        super(props, formItemsList);
        this.formStyle = {itemSpan: 8};
        this.ePickupMode = ePickupMode;
        this.title = "派车单跟踪";
        // this.titleAddOn = 'refresh';
    }

    doMount() {
        getHubList();
        getPickupLocationList();
    }

    handleConcatOrderParam(d) {
        return {OrderParams: [{Key: 'DispatchTime', Order: d.orderParams}]};
    }

    handleCreateParam(d) {
        let param = this.transferParam(d);
        // 日期
        if (param.RangeDate && param.RangeDate.length == 2) {
            param.DispatchStartDate = param.RangeDate[0] && moment(param.RangeDate[0]).isValid() ? param.RangeDate[0].format('YYYY-MM-DD 00:00:00') : '';
            param.DispatchStopDate = param.RangeDate[1] && moment(param.RangeDate[1]).isValid() ? param.RangeDate[1].format('YYYY-MM-DD 23:59:59') : '';
        } else {
            param.DispatchStartDate = '';
            param.DispatchStopDate = '';
        }
        delete param.RangeDate;
        for (let k of ['PickupMode', 'PickupTargetAddrID']) {
            param[k] = param[k] - 0;
        }
        // 企业
        param.PickupStartAddr = (param.PickupStart || {}).text || '';
        delete param.PickupStart;
        param.OrderParams = [{Key: 'DispatchTime', Order: d.orderParams}];
        return param;
        // this.oriParamJson = JSON.stringify(param);
        // DailyAction.GetInterviewList(param);
    }

    sendQuery(param) {
        getSendCarData(param);
    }

    goToMemberDetail(record) {
        if (record.UserID) {
            browserHistory.push({
                pathname: '/broker/member/detail/' + record.UserID,
                query: {
                    memberName: record.UserName
                }
            });
        }
    }

    handleTableChange(pagination, filters, sorter) {
        if (sorter) {
            if (sorter.columnKey == 'DispatchTime') {
                let s_s = sorter.order == 'ascend' ? 0 : 1;
                if (this.props.list.orderParams != s_s) {
                    setParams(this.props.list.state_name, {orderParams: s_s});
                }
            }
        }
    }

    tableColumns(orderParams) {
        const data = this.props.list;
        return [
            {
                title: '序号', key: 'seqNo', width: 42,
                render: (text, record, index) => index + 1
            },
            {
                title: '会员姓名', key: 'UserName',
                render: (text, record) => {
                    return (
                        <div className="cursor-pointer">
                            {
                            record.IsYours ?
                             <span onClick={() => this.goToMemberDetail(record)} className="color-primary">{record.UserName}</span> :
                             <span>{record.UserName}</span>
                            }
                        </div>
                    );
                }
            },
            {
                title: '手机号码', key: 'UserMobile',
                render: (text, record) => {
                    return DataTransfer.phone(record.UserMobile);
                }
            },
            {
                title: '去哪儿接', dataIndex: 'PickupStartAddr'
            },
            {
                title: '往哪儿送', dataIndex: 'PickupTargetAddr'
            },
            {
                title: '派单类型',
                key: 'PickupMode',
                render: (text, record) => this.ePickupMode[record.PickupMode] || ''
            },
            {
                title: '派单状态', dataIndex: 'PickupStatus', types: "status",
                render: (text, record) => {
                    const {PickupStatus, ContactStatus} = record;
                    return (
                        <div>
                            {PickupStatus === 4 ? stateObjs.PickupStatus[PickupStatus] + "(" + stateObjs.ContactStatus[ContactStatus] + ")" : stateObjs.PickupStatus[PickupStatus]}
                        </div>
                    );
                }
            },
            {
                title: '派车日期', key: 'DispatchTime', sorter: true,
                sortOrder: orderParams === 0 ? "ascend" : "descend",
                render: (text, record) => {
                    const t = record.DispatchTime;
                    return t && moment(t).isValid() ? moment(t).format('YYYY/MM/DD HH:mm') : '';
                }
            }

        ];
    }
}