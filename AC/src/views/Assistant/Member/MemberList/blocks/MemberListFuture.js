


import React from 'react';
import QueryListPage from 'COMPONENT/QueryListPage/index';
import {Icon, Button, message} from 'antd';
import AppSessionStorage from "CONFIG/SessionStorage/AppSessionStorage";
import resetState from 'ACTION/resetState';
import moment from 'moment';
import {DataTransfer, paramTransfer} from 'UTIL/base/CommonUtils';
// 业务相关
import MemberAction from 'ACTION/Assistant/MemberAction';
import Mapping_User from 'CONFIG/EnumerateLib/Mapping_User';
import TransferModal from '../../ManagerTransfer/blocks/TransferModal';
import setParams from "ACTION/setParams";
import {getAuthority} from 'CONFIG/DGAuthority';

export default class MemberList extends QueryListPage {
    constructor(props) {
        const eRegSource = {...Mapping_User.eRegSource};
        const eCertStatus = {...Mapping_User.eCertStatus};
        const eTimeInterval = {...Mapping_User.eTimeInterval};

        const auth = getAuthority();
        const formItemsList = [
            {
                name: 'RangeDate',
                label: "注册日期",
                itemType: 'RangePicker',
                placeholder: ['开始日期', '截止日期'],
                initValue: [undefined, undefined]
            },
            {name: 'UserName', label: "会员姓名", itemType: 'Input', placeholder: '输入姓名', initValue: ''},
            {name: 'UserMobile', label: "会员手机号", itemType: 'Input', placeholder: '输入手机号', initValue: ''},
            {
                name: 'BrokerAccount', label: "经纪人",
                // rules: [{required: true, message: '必须输入工号'}],
                itemType: 'Input', placeholder: '输入工号', initValue: ''
            },
            {name: 'QQ', label: "会员QQ", itemType: 'Input', placeholder: '输入QQ', initValue: ''},
            {name: 'WeChat', label: "微信号码", itemType: 'Input', placeholder: '输入微信', initValue: ''},
            {
                name: 'RegSource',
                label: "来源",
                itemType: 'Select',
                type: 'enum',
                enum: eRegSource,
                initValue: '-9999'
            },
            {
                name: 'CertStatus',
                label: "是否认证",
                itemType: 'Select',
                type: 'enum',
                enum: eCertStatus,
                initValue: '-9999'
            }
        ];
        // if (auth.ShowDG) formItemsList.splice(4, 0, {
        //     name: 'DG',
        //     label: "部门/组",
        //     itemType: 'Cascader',
        //     options: auth.DGList,
        //     placeholder: '选择部门/组',
        //     initValue: [-9999]
        // });
        super(props, formItemsList);
        this.eRegSource = eRegSource;
        this.eCertStatus = eCertStatus;
        this.eGender = {...Mapping_User.eGender};
        this.title = "会员列表";
        this.titleAddOn = (<div className="i-refresh">
            <Button type="primary"
                    onClick={() => this.handleGoPage('/ac/member/transfer-log')}
                    ghost>转人日志</Button>
        </div>);
        this.IsManager = auth.IsManager || auth.IsBoss;
        this.eAbnormalType = {
            1: '禁言',
            2: '黑名单'
        };
    }

    doReceiveProps(nextProps) {
        let nextData = nextProps.transfer;
        let curData = this.props.transfer;
        if (nextData.mtChangeBrokerFetch.status == 'success' && curData.mtChangeBrokerFetch.status != 'success') {
            message.info('划转经纪人成功');
            resetState(nextData.state_name);
            this.doQuery(nextProps.list);
        } else if (nextData.mtChangeBrokerFetch.status == 'error' && curData.mtChangeBrokerFetch.status != 'error') {
            let res = nextData.mtChangeBrokerFetch.response;
            message.info('划转经纪人失败' + (res && res.Desc ? ': ' + res.Desc : ''));
            setParams(nextData.state_name, {mtChangeBrokerFetch: {status: 'close'}});
        }
    }


    handleCreateParam(d) {
        console.log('handleCreateParam', d);
        let param = this.transferParam(d, false);
        console.log('handleCreateParam RegSource', param.RegSource, ',CertStatus :', param.CertStatus, ',BrokerAccount :', param.BrokerAccount);
        if ((param.RangeDate && param.RangeDate.length == 2 && (param.RangeDate[0] || param.RangeDate[1])) && !param.BrokerAccount) {
            message.destroy();
            message.info('选择了注册时间,来源或是否认证时，需要输入工号查询');
            return false;
        }
        if ((param.RegSource != -9999 || param.CertStatus != -9999) && !param.BrokerAccount) {
            message.destroy();
            message.info('选择了注册时间,来源或是否认证时，需要输入工号查询');
            return false;
        }
        // 日期
        if (param.RangeDate && param.RangeDate.length == 2) {
            param.RegStartDate = param.RangeDate[0] && moment(param.RangeDate[0]).isValid() ? param.RangeDate[0].format('YYYY-MM-DD') : '';
            param.RegStopDate = param.RangeDate[1] && moment(param.RangeDate[1]).isValid() ? param.RangeDate[1].format('YYYY-MM-DD') : '';
        } else {
            param.RegStartDate = '';
            param.RegStopDate = '';
        }
        delete param.RangeDate;
        // DG
        if (param.DG && param.DG.length > 0) {
            param.BrokerDepartID = param.DG[0];
            if (param.DG.length == 2) param.GroupID = param.DG[1];
            else param.GroupID = -9999;
        } else {
            param.GroupID = -9999;
            param.BrokerDepartID = -9999;
        }
        delete param.DG;
        // DG end
        const q = Object.keys(param).reduce((list, key) => {
            if (['RegSource', 'TimeInterval', 'CertStatus', 'GroupID', 'BrokerDepartID'].indexOf(key) != -1) {
                if (param[key] != -9999) {
                    list.push({Key: key, Value: param[key] - 0});
                }
            } else if (param[key]) {
                list.push({Key: key, Value: param[key]});
            }
            return list;
        }, []);
        let tParam = {
            RecordIndex: d.pageParam.pageSize * (d.pageParam.currentPage - 1),
            RecordSize: d.pageParam.pageSize,
            EmployeeID: AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('employeeId'),
            OrderParams: [{Key: 'RegTime', Order: d.orderParams == 0 ? 1 : 0}],
            QueryParams: q
        };
        return tParam;
        // this.oriParamJson = JSON.stringify(tParam);
        // MemberAction.GetMemberList(tParam);
    }

    sendQuery(param) {
        MemberAction.GetMemberList(param);
    }

    handleShowTransferModal(record) {
        const param = {
            Mobile: record.Mobile,
            Name: record.RealName || record.CallName || record.NickName || ''
        };
        setParams(this.props.transfer.state_name, {Result: param});
    }

    goToMemberDetail(record) {
        this.handleGoPage('/ac/member/detail/' + record.BrokerID + '/' + record.UserID);
    }

    extraComponent() {
        let data = this.props.transfer;
        if (data.Result) {
            return (<TransferModal list={this.props.transfer}/>);
        }
        return '';
    }

    handleConcatOrderParam(d) {
        return {OrderParams: [{Key: 'RegTime', Order: d.orderParams == 0 ? 1 : 0}]};
    }

    handleTableChange(pagination, filters, sorter) {
        if (sorter) {
            if (sorter.columnKey == 'RegTime') {
                let s_s = sorter.order == 'ascend' ? 1 : 0;
                if (this.props.list.orderParams != s_s) {
                    setParams(this.props.list.state_name, {orderParams: s_s});
                }
            }
        }
    }

    tableColumns(orderParams) {
        return [
            {
                title: '会员姓名', key: 'Name', width: 100,
                render: (text, record) => {
                    let abnormalReason = '';
                    if (record.AbnormalInfo && record.AbnormalInfo.length > 0) {
                        abnormalReason = record.AbnormalInfo.map((item) => {
                            return (this.eAbnormalType[item.Type] ? ('【' + this.eAbnormalType[item.Type] + '】') : '') + item.Reason;
                        }).join(',');
                    }
                    return (
                        <div>
                            <span onClick={() => this.goToMemberDetail(record)}
                                  className="color-primary">
                                {record.RealName || record.CallName || record.NickName || ''}</span>
                            {record.IDCardCert &&
                            <span className="iconfont icon-iconheji color-warning ml-8"
                                  style={{fontSize: '18px'}}/>}
                            {record.IsWeekPay && <span
                                className="iconfont icon-zhou color-primary ml-8"
                                style={{fontSize: '18px'}}/>}
                            {record.IsAbnormal && <span
                                title={abnormalReason}
                                className="iconfont icon-zhixingyichang color-grey ml-8"
                                style={{fontSize: '18px'}}/>}
                        </div>

                    );
                }
            },
            {title: '性别', key: 'Gender', width: 60, render: (text, record) => this.eGender[record.Gender] || ''},
            {
                title: '手机号码', key: 'Mobile', width: 120,
                render: (text, record) => {
                    return DataTransfer.phone(record.Mobile);
                }
            },
            {title: 'QQ', dataIndex: 'QQ', width: 120},
            {title: '微信', dataIndex: 'WeChat', width: 120},
            {title: '最近联系记录', dataIndex: 'Content', width: 300},
            {
                title: '最近联系时间', key: 'LastContactTime',
                render: (text, record) => {
                    const t = record.LastContactTime;
                    return t && moment(t).isValid() ? moment(t).format('YYYY/MM/DD HH:mm').replace('2018/', '') : '';
                }
            },
            {
                title: '经纪人', key: 'Broker',
                render: (text, record) => {
                    if (this.IsManager) {
                        return (
                            <div onClick={() => this.handleShowTransferModal(record)}>
                                {`${record.BrokerName}(${record.BrokerAccount})`}
                                <Icon type="edit" className="ml-8 color-primary"/>
                            </div>);
                    } else {
                        return `${record.BrokerName}(${record.BrokerAccount})`;
                    }

                }
            },
            {title: '来源', key: 'RegSource', render: (text, record) => this.eRegSource[record.RegSource] || ''},
            {
                title: '注册时间', key: 'RegTime', sorter: true,
                sortOrder: orderParams === 1 ? "ascend" : "descend",
                render: (text, record) => {
                    const t = record.RegTime;
                    return t && moment(t).isValid() ? moment(t).format('YYYY/MM/DD HH:mm').replace('2018/', '') : '';
                }
            }

        ];
    }
}