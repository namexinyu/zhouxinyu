import React from 'react';
import {Form, Row, Col, Button, Input, Alert, Select, Table, Modal, DatePicker, message} from 'antd';
import setParams from "ACTION/setParams";
import AppSessionStorage from "CONFIG/SessionStorage/AppSessionStorage";
import moment from 'moment';
import SearchFrom from "COMPONENT/SearchForm/index";
import getClient from 'COMPONENT/AliyunUpload/getClient';
import uploadRule from 'CONFIG/uploadRule';
// 业务相关
import CommonAction from 'ACTION/Common';
import CallbackAction from 'ACTION/Audit/CallbackAction';

const Option = Select.Option;

export default class CallbackEntryByUserModal extends React.PureComponent {
    constructor(props) {
        super(props);
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
        this.formItems = [
            {name: 'UserName', label: "会员姓名", itemType: 'Input', placeholder: '输入姓名'},
            {name: 'Mobile', label: "会员手机", itemType: 'Input', placeholder: '输入手机号'}
        ];
    }

    componentWillReceiveProps(nextProps) {
        let nextData = nextProps.list;
        let curData = this.props.list;
        // 翻页
        if (nextData.pageParam != curData.pageParam) {
            this.doQuery(nextData.list);
        }
        // 查询成功时解析图片
        if (nextData.RecordList && nextData.RecordList.length > 0 && nextData.getCallbackEntryListByUserFetch.status == 'success' && curData.getCallbackEntryListByUserFetch.status != 'success') {
            getClient(uploadRule.workerCardPic).then((client) => {
                nextData.RecordList = nextData.RecordList.map((item) => {
                    if (item.CardPicPath) {
                        item.Image = client.signatureUrl(item.CardPicPath);
                    }
                    return item;
                });
                setParams(nextData.state_name,
                    {
                        getCallbackEntryListByUserFetch: {status: 'close'},
                        RecordList: [].concat(nextData.RecordList)
                    }
                );
            });
        }
        // set status
        if (nextData.setCallbackEntryDataByUserFetch.status == 'success' && curData.setCallbackEntryDataByUserFetch.status != 'success') {
            message.info('设置面试状态成功');
            setParams(nextData.state_name, {
                setCallbackEntryDataByUserFetch: {status: 'close'},
                pageParam: {...nextData.pageParam}
            });
        } else if (nextData.setCallbackEntryDataByUserFetch.status == 'error' && curData.setCallbackEntryDataByUserFetch.status != 'error') {
            message.info('设置面试状态失败');
            setParams(nextData.state_name, {
                setCallbackEntryDataByUserFetch: {status: 'close'}
            });
        }
    }

    handleActiveCancel() {
        setParams(this.props.list.state_name, {showModal: false});
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
            RecruitID: -9999,
            InterviewStatus: -9999,
            JFFInterviewStatus: -9999,
            WorkCardStatus: -9999,
            StartDate: '',
            StopDate: '',
            IsAll: 1,
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
        CallbackAction.getCallbackEntryListByUser(param);
    }

    handleSetInterviewStatus(record, value) {
        let param = {
            InterviewID: record.InterviewID,
            InterviewStatus: value - 0
        };
        CallbackAction.setCallbackEntryDataByUser(param);
    }

    render() {
        let data = this.props.list;
        return (
            <Modal visible={true}
                   width={960}

                   closable={false}
                   title={null} footer={null}
                   onCancel={() => this.handleActiveCancel()}>
                <SearchFrom handleSearch={() => this.handleSearch()}
                            dataSource={{}}
                            state_name={data.state_name}
                            queryParams={data.queryParams}
                            formItems={this.formItems}></SearchFrom>
                <Table columns={this.tableColumns()}
                       style={{minHeight: '400px'}}
                       rowKey={(record, index) => index}
                       pagination={false}
                       dataSource={data.RecordList}
                       loading={data.RecordListLoading}></Table>
            </Modal>);
    }

    tableColumns() {
        const imgStyle = {
            position: 'absolute',
            top: 0,
            right: '6px',
            width: '20px',
            height: '2px'
        };
        return [
            // {
            //     title: '编号', key: 'rowKey',
            //     render: (text, record, index) => index + 1
            // },
            {title: '会员姓名', dataIndex: 'UserName'},
            {title: '手机号码', dataIndex: 'Mobile'},
            {title: '企业', dataIndex: 'RecruitName'},
            {
                title: '业务处理',
                key: 'JFFInterviewStatus',
                render: (text, record) => this.eJFFInterviewStatus[record.JFFInterviewStatus] ? this.eJFFInterviewStatus[record.JFFInterviewStatus] : ''
            },
            {title: '业务处理说明', dataIndex: 'JFFInterviewReason'},
            {
                title: '工牌',
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
                            {record.Image ? <img style={imgStyle} src={record.Image}/> : ''}
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
                    if (record.InterviewStatus != 0) {
                        return (
                            <Select value={record.InterviewStatus + ''}
                                    onChange={(value) => this.handleSetInterviewStatus(record, value)}>
                                {[1, 2, 3, 4].map((key, index) => {
                                    return (<Option value={key + ''} key={index}>{this.eInterviewStatus[key]}</Option>);
                                })}
                            </Select>);
                    }
                    return (
                        <Select value={record.InterviewStatus + ''}
                                onChange={(value) => this.handleSetInterviewStatus(record, value)}>
                            {Object.keys(this.eInterviewStatus).map((key, index) => {
                                return (<Option value={key + ''} key={index}>{this.eInterviewStatus[key]}</Option>);
                            })}
                        </Select>);
                }
            },
            {
                title: '签到时间', key: 'CheckinTime',
                render: (text, record) => record.CheckinTime && moment(record.CheckinTime).isValid() ? moment(record.CheckinTime).format('MM/DD HH:mm') : ''
            }

        ];
    }
}