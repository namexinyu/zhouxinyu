import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import { Card, Row, Col, Button, Icon, Form, Input, Modal, Select, DatePicker, message, TimePicker } from 'antd';
import setParams from 'ACTION/setParams';
import ImageShow from 'COMPONENT/ImageShow';
import moment from 'moment';
import AuditOperateAction from 'ACTION/Audit/AuditOperateAction';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetState from 'ACTION/resetState';
import AppSessionStorage from 'CONFIG/SessionStorage/AppSessionStorage';
import getClient from 'COMPONENT/AliyunUpload/getClient';
import uploadRule from 'CONFIG/uploadRule';

const {
    getAttendanceUnAuditRecord,
    getAttendanceUnAuditCount,
    auditAttendance
} = AuditOperateAction;
const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const Option = Select.Option;
class AttendanceContainer extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            failedVisiable: false
        };
    }
    componentWillMount() {
        if (this.props.location.lastKey !== this.props.location.key && !(this.props.location.state && this.props.location.state.clickTab)) {
            getAttendanceUnAuditCount();
            getAttendanceUnAuditRecord();
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.getAttendanceUnAuditRecordFetch.status === 'success') {
            setFetchStatus('state_audit_attendance_operate', 'getAttendanceUnAuditRecordFetch', 'close');
            let data = nextProps.auditAttendanceInfo;
            if (data && data.CountdownCheckinID) {
                getClient(uploadRule.attendancePic).then((client) => {
                    setParams('state_audit_attendance_operate', {
                        attendancePic: data.CheckinPicPath ? client.signatureUrl(data.CheckinPicPath) : ''
                    });
                });
                getClient(uploadRule.workerCardPic).then((client) => {
                    setParams('state_audit_attendance_operate', {
                        workerCardPic: data.CardPicPath ? client.signatureUrl(data.CardPicPath) : ''
                    });
                });
                getClient(uploadRule.auditExamplePic).then((client) => {
                    setParams('state_audit_attendance_operate', {
                        attendanceExapmlePic: data.CheckinPicSamplePath ? client.signatureUrl(data.CheckinPicSamplePath) : ''
                    });
                });
            } else {
                Modal.info({
                    title: '温馨提示',
                    content: '暂无待审核记录'
                });
            }
        }
        if (nextProps.getAttendanceUnAuditRecordFetch.status === 'error') {
            setFetchStatus('state_audit_attendance_operate', 'getAttendanceUnAuditRecordFetch', 'close');
            Modal.error({
                title: window.errorTitle.normal,
                content: nextProps.getAttendanceUnAuditRecordFetch.response.Desc
            });
        }
        if (nextProps.auditAttendanceFetch.status === 'error') {
            setFetchStatus('state_audit_attendance_operate', 'auditAttendanceFetch', 'close');
            Modal.error({
                title: window.errorTitle.normal,
                content: nextProps.auditAttendanceFetch.response.Desc
            });
        }
        if (nextProps.auditAttendanceFetch.status === 'success') {
            setFetchStatus('state_audit_attendance_operate', 'auditAttendanceFetch', 'close');
            message.success('审核操作成功');
            resetState('state_audit_attendance_operate');
            this.setState({
                failedVisiable: false
            });
            getAttendanceUnAuditCount();
            getAttendanceUnAuditRecord();
        }
    }
    handleNoPass() {
        this.setState({
            failedVisiable: true
        });
    }
    handlePass() {
        // TODO api
        this.props.form.validateFieldsAndScroll(['startTime', 'endTime'], (errors, values) => {
            if (!errors) {
                auditAttendance({
                    AuditEmployeeID: AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('employeeId') || '',
                    AuditStatus: 3,
                    CheckinStartDate: this.props.startTime.value ? this.props.startTime.value.format('YYYY-MM-DD HH:00:00') : '',
                    CheckinStopDate: this.props.endTime.value ? this.props.endTime.value.format('YYYY-MM-DD HH:00:00') : '',
                    CountdownCheckinID: this.props.auditAttendanceInfo.CountdownCheckinID || ''
                });
            }
        });
    }
    handleFailedOk() {
        this.props.form.validateFieldsAndScroll(['noPassReason'], (errors, values) => {
            if (!errors) {
                auditAttendance({
                    AuditEmployeeID: AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('employeeId') || '',
                    AuditStatus: 4,
                    CheckinStartDate: this.props.startTime.value ? this.props.startTime.value.format('YYYY-MM-DD HH:00:00') : '',
                    CheckinStopDate: this.props.endTime.value ? this.props.endTime.value.format('YYYY-MM-DD HH:00:00') : '',
                    CountdownCheckinID: this.props.auditAttendanceInfo.CountdownCheckinID || '',
                    CIAuditFailReason: this.props.noPassReason.value ? parseInt(this.props.noPassReason.value, 10) : ''
                });
            }
        });
    }
    handleFailedCancel() {
        this.setState({
            failedVisiable: false
        });
    }



    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <div className="ivy-page-title">
                    <h1>考勤审核({this.props.unAuditCount || 0}个未审核)</h1>
                </div>
                <Card bordered={false}>
                    <Row type="flex" justify="space-around" align="middle" style={{ height: '400px' }} gutter={40} className="mt-8">
                        <Col span={12} className="text-center" style={{ height: '400px' }}>
                            <ImageShow
                                url={this.props.workerCardPic} desc="工牌" />
                        </Col>
                        <Col span={12} className="text-center" style={{ height: '400px' }}>
                            <ImageShow
                                url={this.props.attendancePic} desc="考勤" />
                        </Col>
                    </Row>
                    <Row type="flex" justify="space-around" align="middle" style={{ height: '400px' }} gutter={40} className="mt-8">

                        <Col span={12} className="text-center" style={{ height: '400px' }}>
                            <ImageShow
                                url={this.props.attendanceExapmlePic} desc="考勤样例" />
                        </Col>
                        <Col span={12} className="text-left">
                            <Row>
                                <Col span={24}>
                                    <FormItem {...{
                                        labelCol: { span: 4 },
                                        wrapperCol: { span: 20 }
                                    }} label="企业名称">
                                        {this.props.auditAttendanceInfo.EntName || ''}
                                    </FormItem>
                                </Col>
                                <Col span={24}>
                                    <FormItem {...{
                                        labelCol: { span: 4 },
                                        wrapperCol: { span: 20 }
                                    }} label="姓名">
                                        {this.props.auditAttendanceInfo.UserName || ''}
                                    </FormItem>
                                </Col>
                                <Col span={24}>
                                    <FormItem {...{
                                        labelCol: { span: 4 },
                                        wrapperCol: { span: 20 }
                                    }} label="工号">
                                        {this.props.auditAttendanceInfo.JobNum || ''}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem {...{
                                        labelCol: { span: 8 },
                                        wrapperCol: { span: 16 }
                                    }} label="开始时间">
                                        {getFieldDecorator('startTime', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '考勤日期必选'
                                                },
                                                {
                                                    validator: (errors, value, cb) => {
                                                        if (this.props.endTime.value && value && new Date(value.format('YYYY-MM-DD HH:00:00')).getTime() >= new Date(this.props.endTime.value.format('YYYY-MM-DD HH:00:00')).getTime()) {
                                                            cb('开始日期必须小于结束日期');
                                                        }
                                                        cb();
                                                    }
                                                }
                                            ]
                                        })(<DatePicker
                                            showTime={{
                                                format: 'HH'
                                            }}
                                            format="YYYY-MM-DD HH:00:00"
                                            placeholder="选择考勤开始时间"
                                        />)}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem {...{
                                        labelCol: { span: 8 },
                                        wrapperCol: { span: 16 }
                                    }} label="结束时间">
                                        {getFieldDecorator('endTime', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '考勤日期必选'
                                                },
                                                {
                                                    validator: (errors, value, cb) => {
                                                        if (this.props.startTime.value && value && new Date(value.format('YYYY-MM-DD HH:00:00')).getTime() <= new Date(this.props.startTime.value.format('YYYY-MM-DD HH:00:00')).getTime()) {
                                                            cb('结束日期必须大于开始日期');
                                                        }
                                                        cb();
                                                    }
                                                }
                                            ]
                                        })(<DatePicker
                                            showTime={{
                                                format: 'HH'
                                            }}
                                            format="YYYY-MM-DD HH:00:00"
                                            placeholder="选择考勤结束时间"
                                        />)}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row className="mt-16 text-center">
                                <Button type="danger" htmlType="button" onClick={this.handleNoPass.bind(this)}>不通过</Button>
                                <Button type="primary" htmlType="button" className="ml-8" onClick={this.handlePass.bind(this)}>通过</Button>
                            </Row>
                        </Col>
                    </Row>

                </Card>
                <Modal
                    title="审核不通过"
                    visible={this.state.failedVisiable}
                    onOk={this.handleFailedOk.bind(this)}
                    onCancel={this.handleFailedCancel.bind(this)}
                >
                    <Row>
                        <Col span={24}>
                            <FormItem {...{
                                labelCol: { span: 6 },
                                wrapperCol: { span: 18 }
                            }} label="不通过原因">
                                {getFieldDecorator('noPassReason', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '不通过原因必填'
                                        }
                                    ]
                                })(<Select placeholder="请选择不通过原因" className="w-100" allowClear={true}>
                                    <Option value="1">不清晰</Option>
                                    <Option value="2">不是考勤照片</Option>
                                    <Option value="3">不是本人考勤</Option>
                                    <Option value="4">不是该企业考勤</Option>
                                </Select>)}
                            </FormItem>
                        </Col>
                    </Row>

                </Modal>
            </div >
        );
    }
}

export default Form.create({
    mapPropsToFields: (props) => {
        return {
            startTime: props.startTime,
            endTime: props.endTime,
            noPassReason: props.noPassReason
        };
    },
    onFieldsChange: (props, fields) => {
        setParams('state_audit_attendance_operate', fields);
    }
})(AttendanceContainer);
