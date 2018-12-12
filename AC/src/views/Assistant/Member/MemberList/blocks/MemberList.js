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
import 'LESS/pages/member.less';
import excuse from 'IMAGE/icon_excuse.png';
import black from 'IMAGE/icon_blacklist.png';
import ren from 'IMAGE/icon_renzheng.png';
import Vacantnumber from 'IMAGE/Vacantnumber.png';

export default class MemberList extends QueryListPage {
    constructor(props) {
        const eRegSource = {...Mapping_User.eRegSource};
        const eCertStatus = {...Mapping_User.eCertStatus};
        const eTimeInterval = {...Mapping_User.eTimeInterval};
        const eContactStatus = {
            1: '未联系',
            2: '全部'
        };
        const auth = getAuthority();
        const formItemsList = [
            {
                name: 'RangeDate',
                label: "注册日期",
                itemType: 'RangePicker',
                placeholder: ['开始日期', '截止日期'],
                initValue: [moment().add(-30, 'days'), moment()]
            },
            {name: 'UserName', label: "会员姓名", itemType: 'Input', placeholder: '输入姓名', initValue: ''},
            {name: 'UserMobile', label: "会员电话", itemType: 'Input', placeholder: '输入手机号', initValue: ''},
            {
                name: 'BrokerAccount', label: "经纪人",
                // rules: [{required: true, message: '必须输入工号'}],
                itemType: 'Input', placeholder: '输入工号', initValue: ''
            },
            {
                name: 'ContactStatus',
                label: "是否联系",
                itemType: 'Radio',
                enum: eContactStatus,
                initValue: '2'
            },
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
        console.log('nextProps', nextProps);
        
    }


    handleCreateParam(d) {
        console.log('handleCreateParam', d);
        let param = this.transferParam(d, false);
        console.log('handleCreateParam RegSource', param.RegSource, ',CertStatus :', param.CertStatus, ',BrokerAccount :', param.BrokerAccount);
        // if ((param.RangeDate && param.RangeDate.length == 2 && (param.RangeDate[0] || param.RangeDate[1])) && !param.BrokerAccount) {
        //     message.destroy();
        //     message.info('选择了注册时间,来源或是否认证时，需要输入工号查询');
        //     return false;
        // }
        // if ((param.RegSource != -9999 || param.CertStatus != -9999) && !param.BrokerAccount) {
        //     message.destroy();
        //     message.info('选择了注册时间,来源或是否认证时，需要输入工号查询');
        //     return false;
        // }
        // 日期
        if (param.RangeDate && param.RangeDate.length == 2) {
            param.RegStartDate = param.RangeDate[0] && moment(param.RangeDate[0]).isValid() ? param.RangeDate[0].format('YYYY-MM-DD') : '';
            param.RegStopDate = param.RangeDate[1] && moment(param.RangeDate[1]).isValid() ? param.RangeDate[1].format('YYYY-MM-DD') : '';
        } else {
            param.RegStartDate = '';
            param.RegStopDate = '';
        }
        delete param.RangeDate;
        // 按后台要求新增查询控制逻辑：
        // 0.筛选了姓名，手机号，微信，qq时，去掉注册日期
        // 1.注册时间默认一个月
        // 2.未筛选除联系状态以外的其他项时，注册时间最大跨度为两个月
        // 3.筛选了其他项时，不限制注册时间跨度
        if (param.RegStartDate && param.RegStopDate) {
            console.log('date interval', moment(param.RegStopDate).diff(moment(param.RegStartDate), 'days'));
        }
        // let IsOutTimeRanger = false;
        // let IsFilterOtherParam = false;
        if (param.UserName || param.UserMobile || param.QQ || param.WeChat) {
            param.RegStartDate = '';
            param.RegStopDate = '';
        } else {
            if (!param.RegStartDate || !param.RegStopDate || moment(param.RegStopDate).diff(moment(param.RegStartDate), 'days') > 30) {
                // IsOutTimeRanger = true;
                if (!param.UserName && !param.UserMobile && !param.QQ && !param.WeChat && !param.BrokerAccount) {
                    message.destroy();
                    message.info('未筛选姓名，手机号，微信，QQ，工号时，注册时间跨度不能大于30天');
                    return;
                }
            }
        }
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
            if (['RegSource', 'TimeInterval', 'CertStatus', 'GroupID', 'ContactStatus', 'BrokerDepartID'].indexOf(key) != -1) {
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
            OrderParams: [{
                Key: d.orderInfo.key, Order: d.orderInfo.order === 0 ? 1 : 0
            }],
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
            if (sorter.columnKey === 'RegTime') {
                setParams(this.props.list.state_name, {
                    orderInfo: {
                        key: 'RegTime',
                        order: sorter.order === 'ascend' ? 1 : 0
                    }
                });
                this.doQuery({
                    ...this.props.list,
                    orderInfo: {
                        key: 'RegTime',
                        order: sorter.order === 'ascend' ? 1 : 0
                    }
                });
            }

            if (sorter.columnKey === 'LastContactTime') {
                setParams(this.props.list.state_name, {
                    orderInfo: {
                        key: 'CurrentTime',
                        order: sorter.order == 'ascend' ? 1 : 0
                    }
                });
                this.doQuery({
                    ...this.props.list,
                    orderInfo: {
                        key: 'CurrentTime',
                        order: sorter.order == 'ascend' ? 1 : 0
                    }
                });

            }
        }
    }

    tableColumns(orderInfo) {
        console.log('tablecolumn', orderInfo);
        
        return [
            {title: '序号', key: 'key', width: 43, dataIndex: 'key'},
            {
                title: '会员姓名', key: 'Name',
                className: "removeMobileimg",
                render: (text, record) => {
                    let abnormalReason = '';
                    if (record.AbnormalInfo && record.AbnormalInfo.length > 0) {
                        abnormalReason = record.AbnormalInfo.map((item) => {
                            return (this.eAbnormalType[item.Type] ? ('【' + this.eAbnormalType[item.Type] + '】') : '') + item.Reason;
                        }).join(',');
                    }
                    return (
                        <div onClick={() => this.goToMemberDetail(record)} className="memberimg" style={{cursor: 'pointer', width: "100%", height: "100%"}}>
                            <span style={{color: '#108ee9'}}>
                                {record.NickName}
                            </span>
                            <span style={record['UserTag'].CertStatus == 1 ? {display: 'block'} : {display: 'none'}}>
                                 <img src={ren} />
                            </span>
                            <span style={record['UserTag'].ZXXAbnormalStatus == 1 ? {display: 'block'} : {display: 'none'}}>
                                 <img src={black} />
                            </span>
                            <span style={record['UserTag'].Shutup == 2 ? {display: 'block'} : {display: 'none'}}>
                                 <img src={excuse} />
                            </span>
                            {
                                record.NullStatus && <span>
                                    <img style={{width: "30px", height: "30px", position: "absolute", top: "0%", left: "0%"}} src={Vacantnumber} />
                                </span>
                            }
                            
                           
                        </div>

                    );
                }
            },
            {title: '性别', key: 'Gender', width: 60, render: (text, record) => this.eGender[record.Gender] || ''},
            {
                title: 'QQ', dataIndex: 'QQ', width: 120
            },
            {
                title: '微信', dataIndex: 'WeChat', width: 120
            },
            {
                title: '手机号码', key: 'Mobile', width: 120,
                render: (text, record) => {
                    return DataTransfer.phone(record.Mobile);
                }
            },
            {
                title: '最近联系记录', dataIndex: 'Content', width: 300
            },
            {
                title: '最近联系时间', key: 'LastContactTime',
                sorter: true,
                sortOrder: orderInfo.key === 'CurrentTime' ? (orderInfo.order === 1 ? 'ascend' : 'descend') : '',
                width: 125,
                render: (text, record) => {
                    const t = record.LastContactTime;
                    return t && moment(t).isValid() ? moment(t).format('YYYY/MM/DD HH:mm') : '';
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
            {title: '推荐人', width: 70, key: 'InviteUsers', render: (text, record) => <span>{record['InviteUser'] ? record['InviteUser']['RealName'] ? record['InviteUser']['RealName'] : '' : ''}</span>},
            {title: '来源', key: 'RegSource', render: (text, record) => this.eRegSource[record.RegSource] || ''},
            {
                title: '注册时间', key: 'RegTime', sorter: true,
                sortOrder: orderInfo.key === 'RegTime' ? (orderInfo.order === 1 ? 'ascend' : 'descend') : '',
                width: 85,
                render: (text, record) => {
                    const t = record.RegTime;
                    return t && moment(t).isValid() ? moment(t).format('YYYY/MM/DD HH:mm') : '';
                }
            }

        ];
    }
}
