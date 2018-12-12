import React from 'react';
import {Form, Row, Col, Button, Input, Alert, Select, Table, DatePicker, message} from 'antd';
import setParams from "ACTION/setParams";
import AppSessionStorage from "CONFIG/SessionStorage/AppSessionStorage";
import moment from 'moment';
import SearchFrom from "COMPONENT/SearchForm/index";
import getClient from 'COMPONENT/AliyunUpload/getClient';
import uploadRule from 'CONFIG/uploadRule';
// 业务相关
import CommonAction from 'ACTION/Common';
import CallbackAction from 'ACTION/Audit/CallbackAction';
import CallbackService from 'SERVICE/Audit/CallbackService';
import CallbackEntryByUserModal from './CallbackEntryByUserModal';
import CallbackStatusModal from './CallbackStatusModal';

const Option = Select.Option;

export default class CallbackEntry extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            callbackStatusModalVisible: false,
            detailInfo: {},
            rowRecord: {}
        };
        this.handleSetServiceRemark = this.handleSetServiceRemark.bind(this);
        this.handleChangeServiceRemark = this.handleChangeServiceRemark.bind(this);
        this.handleEditServiceRemark = this.handleEditServiceRemark.bind(this);
        // 1、审核中 2、审核通过 3、审核失败 4、未上传
        this.eWorkCardStatus = {
            1: '审核中',
            2: '审核通过',
            3: '审核失败',
            4: '未上传'
        };
        // 0、未处理； 1、未面试； 2、通过； 3、未通过； 4、放弃
        this.eJFFInterviewStatus = {
            0: '未处理',
            1: '未面试',
            2: '通过',
            3: '未通过',
            4: '放弃'
        };
        // 0、未处理； 1、未面试； 2、正常入职； 3、未通过； 4、放弃
        this.eInterviewStatus = {
            0: '未处理',
            1: '待定或面试失联',
            2: '正常入职',
            3: '未通过',
            4: '放弃'
        };
        this.eIsAllType = {
            1: '是',
            2: '否'
        };
        // disabledDate: (current) => {
        //     console.log(current.format('MM-DD'));
        //     if (moment(current.format('YYYY-MM-DD')).diff(moment(moment().format('YYYY-MM-DD')), 'days') > 0
        //         || moment(current.format('YYYY-MM-DD')).diff(moment(moment().format('YYYY-MM-DD')), 'days') < -2) return true;
        //     return false;
        // },
        this.formItems = [
            // {name: 'StartDate', label: "开始日期", itemType: 'DatePicker', placeholder: '开始日期'},
            // {name: 'StopDate', label: "截止日期", itemType: 'DatePicker', placeholder: '截止日期'},
            {
                name: 'RangeDate',
                label: "签到日期",
                itemType: 'RangePicker',
                disabledDate: (current) => {
                    if (moment(current.format('YYYY-MM-DD')).diff(moment(moment().format('YYYY-MM-DD')), 'days') > -2) return true;
                    return false;
                },
                allowClear: false,
                placeholder: ['开始日期', '截止日期']
            },
            {name: 'UserName', label: "会员姓名", itemType: 'Input', placeholder: '输入姓名'},
            {name: 'Mobile', label: "会员手机", itemType: 'Input', placeholder: '输入手机号'},
            {
                name: 'Recruit',
                label: "签到企业",
                itemType: 'AutoCompleteInput',
                valueKey: 'RecruitTmpID',
                textKey: 'RecruitName',
                dataArray: "RecruitSimpleList",
                placeholder: '请选择企业'
            },
            {
                name: 'WorkCardStatus', label: "工牌状态", itemType: 'Select', type: 'enum', enum: this.eWorkCardStatus
            },
            {
                name: 'JFFInterviewStatus',
                label: "业务处理",
                itemType: 'Select',
                type: 'enum',
                enum: this.eJFFInterviewStatus
            },
            {
                name: 'InterviewStatus', label: "面试状态", itemType: 'Select', type: 'enum', enum: this.eInterviewStatus
            }, {
                name: 'IsAll',
                label: "只看本人",
                itemType: 'Radio',
                type: 'enum',
                enum: this.eIsAllType
            }
        ];
    }

    componentWillMount() {
        let location = this.props.location;
        if (location.lastKey !== location.key && !(location.state && location.state.clickTab)) {
            this.doQuery(this.props.list);
            CommonAction.getRecruitSimpleList();
        }
    }

    componentWillReceiveProps(nextProps) {
        let nextData = nextProps.list;
        let curData = this.props.list;
        // 翻页
        if (nextData.pageParam != curData.pageParam) {
            this.doQuery(nextData);
        }
        // 查询成功时解析图片
        if (nextData.RecordList && nextData.RecordList.length > 0 && nextData.getCallbackEntryListFetch.status == 'success' && curData.getCallbackEntryListFetch.status != 'success') {
            getClient(uploadRule.workerCardPic).then((client) => {
                nextData.RecordList = nextData.RecordList.map((item) => {
                    if (item.CardPicPath) {
                        item.Image = client.signatureUrl(item.CardPicPath);
                    }
                    return item;
                });
                setParams(nextData.state_name,
                    {
                        getCallbackEntryListFetch: {status: 'close'},
                        RecordList: [].concat(nextData.RecordList)
                    }
                );
            });
        }
        // set status
        if (nextData.setCallbackEntryDataFetch.status == 'success' && curData.setCallbackEntryDataFetch.status != 'success') {
            message.info('设置面试状态成功');
            setParams(nextData.state_name, {
                setCallbackEntryDataFetch: {status: 'close'},
                pageParam: {...nextData.pageParam}
            });
        } else if (nextData.setCallbackEntryDataFetch.status == 'error' && curData.setCallbackEntryDataFetch.status != 'error') {
            message.info('设置面试状态失败');
            setParams(nextData.state_name, {
                setCallbackEntryDataFetch: {status: 'close'}
            });
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
        Object.keys(data.queryParams).map((key) => {
            if (['InterviewStatus', 'JFFInterviewStatus', 'WorkCardStatus'].indexOf(key) != -1) {
                param[key] = data.queryParams[key].value - 0;
            } else {
                param[key] = data.queryParams[key].value;
            }
        });
        param.RecruitID = param.Recruit && param.Recruit.value ? param.Recruit.value - 0 : -9999;
        delete param.Recruit;
        if (param.RangeDate && param.RangeDate.length == 2) {
            // param.StartDate = param.RangeDate[0] && moment(param.RangeDate[0]).isValid() ? param.RangeDate[0].format('YYYY-MM-DD') : moment().add(-2, 'days').format('YYYY-MM-DD');
            // param.StopDate = param.RangeDate[1] && moment(param.RangeDate[1]).isValid() ? param.RangeDate[1].format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
            param.StartDate = param.RangeDate[0] && moment(param.RangeDate[0]).isValid() ? param.RangeDate[0].format('YYYY-MM-DD') : '';
            param.StopDate = param.RangeDate[1] && moment(param.RangeDate[1]).isValid() ? param.RangeDate[1].format('YYYY-MM-DD') : '';
        } else {
            param.StartDate = '';
            param.StopDate = '';
        }
        delete param.RangeDate;
        param.IsAll = param.IsAll == 1 ? 2 : 1;
        param.PayType = +data.EntType;
        CallbackAction.getCallbackEntryList(param);
        CallbackService.getCallbackEntryNotDealNum().then((res) => {
            if (res && res.Data && res.Data.Num) {
                setParams(data.state_name, {NotDealNum: res.Data.Num});
            }
        }, (err) => console.log(err));
    }

    handleSetInterviewStatus(record, value) {
        let param = {
            InterviewID: record.InterviewID,
            InterviewStatus: value - 0
        };
        CallbackAction.setCallbackEntryData(param);
    }

    handleEditServiceRemark(key, value) {
        let data = this.props.list;
        setParams(data.state_name, {tmpObj: Object.assign({}, data.tmpObj, {[key - 0]: value})});
    }

    handleChangeServiceRemark(e) {
        let data = this.props.list;
        const value = e.target.value;
        const key = e.target.getAttribute('id').replace('service-remark-', '').replace('/\r|\n/g', '');
        console.log('handleChangeServiceRemark', e.target, 'key:' + key, 'value:' + value);
        setParams(data.state_name, {tmpObj: Object.assign({}, data.tmpObj, {[key - 0]: value})});
    }

    handleSetServiceRemark(key, dataNo) {
        let data = this.props.list;
        let param = {
            InterviewID: dataNo,
            ServiceRemark: data.tmpObj[key]
        };
        CallbackService.WriteServiceRemark(param).then((res) => {
            message.info('填写回访记录成功');
            this.doQuery();
        }, (err) => {
            message.info('填写回访记录失败' + err && err.Desc ? ':' + err.Desc : '');
        });
    }

    handleSwitchEntTyppe = (type) => {
        const {
            list: {
                state_name,
                queryParams,
                pageParam,
                EntType
            }
        } = this.props;
        if (+type === +EntType) {
            return;
        }
        setParams(state_name, {
            EntType: type,
            pageParam: {
                ...pageParam,
                currentPage: 1   
            }
        });

        CallbackAction.getCallbackEntryList({
            RecordIndex: 0,
            RecordSize: pageParam.pageSize,
            UserName: queryParams.UserName.value || '',
            Mobile: queryParams.Mobile.value || '',
            IsAll: +queryParams.IsAll.value === 2 ? 1 : 2,
            InterviewStatus: +queryParams.InterviewStatus.value,
            JFFInterviewStatus: +queryParams.JFFInterviewStatus.value,
            WorkCardStatus: +queryParams.WorkCardStatus.value,
            RecruitID: queryParams.Recruit.value.value ? +queryParams.Recruit.value.value : -9999,
            StartDate: queryParams.RangeDate.value && queryParams.RangeDate.value.length && queryParams.RangeDate.value[0] ? moment(queryParams.RangeDate.value[0]).format('YYYY-MM-DD') : '',
            StopDate: queryParams.RangeDate.value && queryParams.RangeDate.value.length && queryParams.RangeDate.value[1] ? moment(queryParams.RangeDate.value[1]).format('YYYY-MM-DD') : '',
            PayType: +type
        });
        CallbackService.getCallbackEntryNotDealNum().then((res) => {
            if (res && res.Data && res.Data.Num) {
                setParams(state_name, {NotDealNum: res.Data.Num});
            }
        }, (err) => console.log(err));
    }

    handleStatusSync = (record) => {
        CallbackService.getThreeCardStatus({
            IdCardNum: record.IdCardNum,
            EntId: record.RecruitID,
            InterviewID: record.InterviewID,
            IneterviewDate: record.IneterviewDate
        }).then((res) => {
            if (res.Data.Status) {
                CallbackService.setCallbackEntryData({
                    InterviewID: record.InterviewID,
                    InterviewStatus: 2
                }).then((resp) => {
                    if (resp.Code === 0) {
                        message.success('周薪薪入职状态同步完成');
                        this.doQuery();
                    } else {
                        message.error(resp.Desc || '周薪薪入职状态同步失败，稍后再试');                        
                    }
                }).catch((error) => {
                    message.error(error.Desc || '周薪薪入职状态同步失败，稍后再试');
                });
            } else {
                message.error(res.Desc || '周薪薪入职状态同步失败，稍后再试');
            }
        }).catch((err) => {
            message.error(err.Desc || '周薪薪入职状态同步失败，稍后再试');
        });
    }

    handleShowCallbackStatusModal = (record) => {
        CallbackService.getCallbackStatusDetail({
            InterviewID: record.InterviewID
        }).then((res) => {
            if (res.Code === 0) {
                const data = res.Data || {};
                this.setState({
                    rowRecord: record,
                    detailInfo: {
                        InterviewStatus: data.InterviewStatus || 0,
                        ServiceRemark: data.ServiceRemark || '',
                        ToBroker: data.ToBroker || '',
                        ToExperience: data.ToExperience || ''
                    },
                    callbackStatusModalVisible: true
                });
            } else {
                message.error(res.Desc || '出错了，请稍后尝试');
            }
        }).catch((err) => {
            message.error(err.Desc || '出错了，请稍后尝试');
        });
    }

    handleOk = (hidden = false) => {
        this.doQuery();
        hidden && this.handleCancel();
    }

    handleCancel = () => {
        this.setState({
            callbackStatusModalVisible: false
        }, () => {
            this.setState({
                rowRecord: {},
                detailInfo: {}
            });
        });
    }

    render() {
        let data = this.props.list;
        const extraItems = [
            <Col span={6} key={0}>
                <div>
                    <Button className="mr-16" type="primary" size="large" ghost={data.EntType !== 0} onClick={() => this.handleSwitchEntTyppe(0)}>我打</Button>
                    <Button className="mr-16" type="primary" size="large" ghost={data.EntType !== 1} onClick={() => this.handleSwitchEntTyppe(1)}>周薪薪</Button>
                </div>
            </Col>
        ];
        return (
            <div className='callback-entry-view'>
                <div className="ivy-page-title" style={{position: 'relative'}}>
                    <h1>入职回访</h1>
                    <span style={{
                        position: 'absolute',
                        cursor: 'pointer',
                        top: 0,
                        right: '20px',
                        padding: '0 8px'
                    }} onClick={() => setParams(this.props.listByUser.state_name, {showModal: true})}>
                        <Button type="primary">重置面试结果</Button>
                    </span>
                </div>
                <Row>
                    <div className="container-fluid">
                        <div className="container bg-white mt-20">
                            <SearchFrom handleSearch={() => this.handleSearch()}
                                        dataSource={{RecruitSimpleList: this.props.RecruitSimpleList}}
                                        state_name={data.state_name}
                                        queryParams={data.queryParams}
                                        extraItems={extraItems}
                                        formItems={this.formItems}></SearchFrom>
                            {/* <Row className="mt-8 mb-8">
                                <Col>
                                    <Alert message={`待处理签到数 ${data.NotDealNum} 个，请尽快处理！`} type="info"></Alert>
                                </Col>
                            </Row> */}
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

                            <CallbackStatusModal
                                entType={data.EntType}
                                interviewStatusMap={this.eInterviewStatus}
                                jffInterviewStatusMap={this.eJFFInterviewStatus}
                                workCardStatusMap={this.eWorkCardStatus}
                                rowRecord={this.state.rowRecord}
                                detailInfo={this.state.detailInfo}
                                visible={this.state.callbackStatusModalVisible}
                                onCancel={this.handleCancel}
                                onOk={this.handleOk}
                            />
                        </div>
                    </div>
                </Row>
                {this.props.listByUser.showModal ? <CallbackEntryByUserModal list={this.props.listByUser}/> : ''}
            </div>
        );
    }

    tableColumns() {
        const imgStyle = {
            position: 'absolute',
            top: 0,
            right: '6px',
            width: '20px',
            height: '20px'
        };
        const data = this.props.list;
        return [
            {title: '会员姓名', dataIndex: 'UserName'},
            {title: '手机号码', dataIndex: 'Mobile',
                render: (text) => {
                    return text.replace(/(\d{3})\d{4}(\d{3,})/, '$1****$2');
                }
            },
            {title: '企业', dataIndex: 'RecruitName'},
            {
                title: '业务处理',
                key: 'JFFInterviewStatus',
                render: (text, record) => this.eJFFInterviewStatus[record.JFFInterviewStatus] ? this.eJFFInterviewStatus[record.JFFInterviewStatus] : ''
            },
            {title: '业务处理说明', dataIndex: 'JFFInterviewReason'},
            {
                title: data.EntType === 0 ? '工牌' : '三卡',
                key: 'WorkCardStatus',
                render: (text, record) => {
                    if (record.WorkCardStatus == 1 || record.WorkCardStatus == 4) {
                        return (<span style={{color: 'rgba(255, 153, 0, 0.647)'}}>
                            {this.eWorkCardStatus[record.WorkCardStatus]}</span>);
                    } else if (record.WorkCardStatus == 2 || record.WorkCardStatus == 3) {
                        const sStyle = {
                            position: 'relative',
                            color: record.WorkCardStatus == 2 ? 'rgb(0, 153, 0)' : 'rgba(255, 0, 0, 0.647)'
                        };
                        return (<span className="pr-32" style={sStyle}>
                            {this.eWorkCardStatus[record.WorkCardStatus]}
                            {record.Image ? <img style={imgStyle} src={record.Image}
                                                 onClick={() => window.open(record.Image)}/> : ''}
                            </span>);
                    } else {
                        return '';
                    }
                }
            },
            {
                title: '面试结果',
                key: 'InterviewStatus',
                render: (text, record) => {
                    if (data.EntType === 0) {
                        return (
                            <a onClick={() => this.handleShowCallbackStatusModal(record)}>{this.eInterviewStatus[record.InterviewStatus]}</a>
                        );
                    } else {
                        return (
                            <div>
                                {record.ZXXType === 2 && record.InterviewStatus !== 2 ? (
                                    <a onClick={() => this.handleStatusSync(record)}>入职状态同步</a>
                                ) : (
                                    <span>{this.eInterviewStatus[record.InterviewStatus]}</span>
                                )}
                                <a className="ml-10" onClick={() => this.handleShowCallbackStatusModal(record)}>回访</a>
                            </div>
                        );
                    }
                    // if (data.EntType === 0) {
                    //     if (record.InterviewStatus == 2 || record.InterviewStatus == 3 || record.InterviewStatus == 4) {
                    //         return this.eInterviewStatus[record.InterviewStatus];
                    //     }
                    //     else if (record.InterviewStatus == 1) {
                    //         return (<Select value={record.InterviewStatus + ''} style={{width: '119px'}}
                    //                         onChange={(value) => this.handleSetInterviewStatus(record, value)}>
                    //             {[1, 2, 3, 4].map((key, index) => {
                    //                 return (<Option value={key + ''} key={index}>{this.eInterviewStatus[key]}</Option>);
                    //             })}
                    //         </Select>);
                    //     }
                    //     return (
                    //         <Select value={record.InterviewStatus + ''} style={{width: '119px'}}
                    //                 onChange={(value) => this.handleSetInterviewStatus(record, value)}>
                    //             {Object.keys(this.eInterviewStatus).map((key, index) => {
                    //                 return (<Option value={key + ''} key={index}>{this.eInterviewStatus[key]}</Option>);
                    //             })}
                    //         </Select>);
                    // } else {
                    //     if (record.ZXXType === 2 && record.InterviewStatus !== 2) {
                    //         return (
                    //             <Button onClick={() => this.handleStatusSync(record)}>入职状态同步</Button>
                    //         );
                    //     } else {
                    //         return this.eInterviewStatus[record.InterviewStatus];
                    //     }
                    // }
                    
                }
            },
            // {
            //     title: '回访记录',
            //     key: 'ServiceRemark',
            //     className: data.EntType === 1 ? 'display-none' : '',
            //     render: (text, record, index) => {
            //         if (!record.ServiceRemark || data.tmpObj[index]) {
            //             return (<Input id={"service-remark-" + index} value={data.tmpObj[index]}
            //                            addonAfter={
            //                                <div onClick={() => this.handleSetServiceRemark(index, record.InterviewID)}
            //                                     className="color-primary">
            //                                    保存</div>}
            //                            onChange={this.handleChangeServiceRemark}/>);
            //         } else {
            //             return (<div
            //                 onClick={() => this.handleEditServiceRemark(index, record.ServiceRemark)}>{record.ServiceRemark}</div>);
            //         }
            //     }
            // },
            {
                title: '指派客服',
                dataIndex: 'EmployeeName'
            },
            {
                title: '签到时间', key: 'CheckinTime',
                render: (text, record) => record.CheckinTime && moment(record.CheckinTime).isValid() ? moment(record.CheckinTime).format('MM/DD HH:mm') : ''
            }

        ];
    }
}