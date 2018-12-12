import QueryListPage from 'COMPONENT/QueryListPage/index';
import React from 'react';
import {Icon} from 'antd';
import moment from 'moment';
import AppSessionStorage from "CONFIG/SessionStorage/AppSessionStorage";
import {browserHistory} from 'react-router';
import uploadRule from 'CONFIG/uploadRule';
import getClient from 'COMPONENT/AliyunUpload/getClient';
import ossConfig from 'CONFIG/ossConfig';
import ActionMAMSRecruitment from 'ACTION/Common/Recruitment/ActionMAMSRecruitment';
import stateObjs from "VIEW/StateObjects";
// 业务相关
import getFactoryCheckinList from 'ACTION/Broker/TodayEstimateSign/getFactoryCheckinList';
import setParams from "ACTION/setParams";
import {DataTransfer, paramTransfer} from 'UTIL/base/CommonUtils';

const recordImgStyle = {
    display: 'inline-block',
    border: '1px solid #666666',
    padding: '5px',
    cursor: 'pointer',
    width: '50px',
    height: '50px'
};

export default class FactoryCheckin extends QueryListPage {
    constructor(props) {
        const eProcessStatus = {
            1: "未处理",
            2: "处理中",
            3: "已处理",
            4: "作废"
        };
        const formItemsList = [
            {name: 'CheckInDate', label: '面试日期', itemType: 'DatePicker', initValue: moment()},
            {name: 'RealName', label: "会员姓名", itemType: 'Input', placeholder: '输入姓名', initValue: ''},
            {name: 'Mobile', label: "手机号码", itemType: 'Input', placeholder: '输入手机号', initValue: ''},
            {
                name: 'Recruit',
                label: "面试企业",
                itemType: 'AutoCompleteInput',
                placeholder: '请输入企业',
                valueKey: 'RecruitTmpID',
                textKey: 'RecruitName',
                dataArray: 'recruitFilterList'
            },
            {
                name: 'ProcessStatus',
                label: "处理状态",
                itemType: 'Select',
                type: 'enum',
                enum: eProcessStatus,
                initValue: '-9999'
            }
        ];
        super(props, formItemsList);
        this.formStyle = {itemSpan: 8};
        this.title = "厂门口接站名单";
        this.eProcessStatus = eProcessStatus;
        // this.titleAddOn = 'refresh';
    }

    doMount() {
        // getHubList();
        // getPickupLocationList();
        ActionMAMSRecruitment.GetMAMSRecruitFilterList();
        getClient(uploadRule.idCardPic).then((client) => {
            this.client = client;
        });
    }

    doReceiveProps(nextProps) {
        let nData = nextProps.list;
        let data = this.props.list;
        let nRecordList = nData.RecordList;
        let RecordList = data.RecordList;
        if (nRecordList && nData.status === 'success' && data.status !== 'success') {
            let dealPic = () => {
                for (let record of nRecordList) {
                    // if (record.ImageBack || record.ImageFront) {
                    //     IsUpdated = true;
                    //     break;
                    // }
                    record.ImageBack = record.IDCardPicPathBack ? this.client.signatureUrl(record.IDCardPicPathBack) : '';
                    record.ImageFront = record.IDCardPicPathFront ? this.client.signatureUrl(record.IDCardPicPathFront) : '';
                }
                setParams(nData.state_name, {RecordList: [].concat(nRecordList)});
            };
            if (this.client) {
                dealPic();
            } else {
                getClient(uploadRule.idCardPic).then((client) => {
                    this.client = client;
                    dealPic();
                });
            }
        }
    }

    // handleConcatOrderParam(d) {
    //     return {OrderParams: [{Key: 'DispatchTime', Order: d.orderParams}]};
    // }

    handleCreateParam(d) {
        let param = this.transferParam(d);
        // 日期
        if (param.CheckInDate && moment(param.CheckInDate).isValid()) {
            param.CheckInDate = moment(param.CheckInDate).format("YYYY-MM-DD");
        }
        for (let k of ['ProcessStatus']) {
            param[k] = param[k] - 0;
        }
        // 企业
        param.RecruitName = (param.Recruit || {}).text || '';
        delete param.Recruit;
        // param.OrderParams = [{Key: 'DispatchTime', Order: d.orderParams}];
        return param;
        // this.oriParamJson = JSON.stringify(param);
        // DailyAction.GetInterviewList(param);
    }

    sendQuery(param) {
        getFactoryCheckinList(param);
    }

    goToMemberDetail(record) {
        if (record.UserID) {
            browserHistory.push({
                pathname: '/broker/member/detail/' + record.UserID,
                query: {
                    memberName: record.RealName
                }
            });
        }
    }

    // handleTableChange(pagination, filters, sorter) {
    //     if (sorter) {
    //         if (sorter.columnKey == 'CheckInDate') {
    //             let s_s = sorter.order == 'ascend' ? 0 : 1;
    //             if (this.props.list.orderParams != s_s) {
    //                 setParams(this.props.list.state_name, {orderParams: s_s});
    //             }
    //         }
    //     }
    // }

    tableColumns(orderParams) {
        const data = this.props.list;
        return [
            {
                title: '序号', key: 'seqNo', width: 42,
                render: (text, record, index) => index + 1
            },
            {
                title: '面试日期', key: 'CheckInDate', sorter: true,
                sortOrder: orderParams === 0 ? "ascend" : "descend",
                render: (text, record) => {
                    const t = record.CheckInDate;
                    return t && moment(t).isValid() ? moment(t).format('YYYY/MM/DD') : '';
                }
            },
            {
                title: '会员姓名', key: 'RealName',
                render: (text, record) => {
                    return (
                        <div className="cursor-pointer">
                            <span onClick={() => this.goToMemberDetail(record)}
                                  className="color-primary">{record.RealName}</span>
                        </div>
                    );
                }
            },
            {
                title: '手机号码', key: 'Mobile',
                render: (text, record) => {
                    return DataTransfer.phone(record.Mobile);
                }
            },
            {
                title: '身份证号', key: 'IDCardNum',
                render: (text, record) => {
                    return DataTransfer.idcard(record.IDCardNum);
                }
            },
            {
                title: '企业', dataIndex: 'RecruitName'
            },
            {
                title: '到达时间', key: 'CheckInTime',
                render: (text, record) => {
                    const t = record.CheckInDate;
                    return t && moment(t).isValid() ? moment(t).format('HH时mm分') : '';
                }
            },
            {
                title: '处理状态', key: 'ProcessStatus',
                render: (text, record) => {
                    return this.eProcessStatus[record.ProcessStatus] || '';
                }
            },
            {
                title: '处理说明', dataIndex: 'ProcessRemark'
            },
            {
                title: '身份证照片', key: 'Picture',
                render: (text, record) => {
                    return (<div>
                        {record.ImageBack ?
                            (<img className="mr-16" style={recordImgStyle}
                                  onClick={() => window.open(record.ImageBack, '_blank')}
                                  src={record.ImageBack}/>) : '-     '}
                        {record.ImageFront ?
                            (<img style={recordImgStyle}
                                  onClick={() => window.open(record.ImageFront, '_blank')}
                                  src={record.ImageFront}/>) : '-'}
                    </div>);
                }
            },
            {
                title: '创建时间', key: 'CreateDate',
                render: (text, record) => {
                    const t = record.CreateDate;
                    return t && moment(t).isValid() ? moment(t).format('YYYY/MM/DD HH:mm:ss') : '';
                }
            }
        ];
    }
}