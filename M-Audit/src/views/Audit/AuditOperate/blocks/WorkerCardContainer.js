import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import { Card, Row, Col, Button, Icon, Form, Input, Modal, Select, message } from 'antd';
import setParams from 'ACTION/setParams';
import ImageShow from 'COMPONENT/ImageShow';
import AuditOperateAction from 'ACTION/Audit/AuditOperateAction';
import resetState from 'ACTION/resetState';
import setFetchStatus from 'ACTION/setFetchStatus';
import AppSessionStorage from 'CONFIG/SessionStorage/AppSessionStorage';
import getClient from 'COMPONENT/AliyunUpload/getClient';
import uploadRule from 'CONFIG/uploadRule';

const {
    getWorkerCardUnAuditRecord,
    getWorkerCardUnAuditCount,
    auditWorkerCard
} = AuditOperateAction;

const FormItem = Form.Item;
const Option = Select.Option;
class WorkerCardContainer extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            failedVisiable: false,
            successVisiable: false
        };
    }
    componentWillMount() {
        if (this.props.location.lastKey !== this.props.location.key && !(this.props.location.state && this.props.location.state.clickTab)) {
            getWorkerCardUnAuditCount();
            getWorkerCardUnAuditRecord();
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.getWorkerCardUnAuditRecordFetch.status === 'success') {
            setFetchStatus('state_audit_workerCard_operate', 'getWorkerCardUnAuditRecordFetch', 'close');
            let data = nextProps.auditWorkerInfo;
            if (data && data.WorkCardFlowID) {
                getClient(uploadRule.workerCardPic).then((client) => {
                    setParams('state_audit_workerCard_operate', {
                        cardPic: data.CardPicPath ? client.signatureUrl(data.CardPicPath) : ''
                    });
                });
                getClient(uploadRule.auditExamplePic).then((client) => {
                    setParams('state_audit_workerCard_operate', {
                        examplePic: data.CardPicSamplePath ? client.signatureUrl(data.CardPicSamplePath) : ''
                    });
                });
            } else {
                Modal.info({
                    title: '温馨提示',
                    content: '暂无待审核记录'
                });
            }
        }
        if (nextProps.getWorkerCardUnAuditRecordFetch.status === 'error') {
            setFetchStatus('state_audit_workerCard_operate', 'getWorkerCardUnAuditRecordFetch', 'close');
            Modal.error({
                title: window.errorTitle.normal,
                content: nextProps.getWorkerCardUnAuditRecordFetch.response.Desc
            });
        }
        if (nextProps.auditWorkerCardFetch.status === 'error') {
            setFetchStatus('state_audit_workerCard_operate', 'auditWorkerCardFetch', 'close');
            Modal.error({
                title: window.errorTitle.normal,
                content: nextProps.auditWorkerCardFetch.response.Desc
            });
        }
        if (nextProps.auditWorkerCardFetch.status === 'success') {
            setFetchStatus('state_audit_workerCard_operate', 'auditWorkerCardFetch', 'close');
            message.success('审核操作成功');
            resetState('state_audit_workerCard_operate');
            this.setState({
                failedVisiable: false,
                successVisiable: false
            });
            getWorkerCardUnAuditCount();
            getWorkerCardUnAuditRecord();
        }
    }
    handleNoPass() {
        this.setState({
            failedVisiable: true
        });
    }
    handlePass() {
        this.props.form.validateFieldsAndScroll(['workerId'], (errors, values) => {
            if (!errors) {
                this.setState({
                    successVisiable: true
                });
                setParams('state_audit_workerCard_operate', {
                    r_workerId: {
                        value: ''
                    }
                });
            }
        });
    }
    handleFailedOk() {
        this.props.form.validateFieldsAndScroll(['noPassReason'], (errors, values) => {
            if (!errors) {
                // TODO api
                auditWorkerCard({
                    AuditEmployeeID: AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('employeeId') || '',
                    AuditStatus: 4,
                    JobNum: this.props.workerId.value || '',
                    WorkCardFlowID: this.props.auditWorkerInfo.WorkCardFlowID || '',
                    WCAuditFailReason: this.props.noPassReason.value ? parseInt(this.props.noPassReason.value, 10) : ''
                });
            }
        });
    }
    handleFailedCancel() {
        this.setState({
            failedVisiable: false
        });
    }
    handleConfirmPass() {
        this.props.form.validateFieldsAndScroll(['r_workerId'], (errors, values) => {
            if (!errors) {
                if (this.props.workerId.value !== this.props.r_workerId.value) {
                    Modal.error({
                        title: '输入错误',
                        content: '请仔细核对输入的工号',
                        okText: '立即重新输入',
                        onOk: () => {
                            this.setState({
                                successVisiable: false
                            });
                        }
                    });
                    return false;
                }
                auditWorkerCard({
                    AuditEmployeeID: AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('employeeId') || '',
                    AuditStatus: 3,
                    JobNum: this.props.workerId.value || '',
                    WorkCardFlowID: this.props.auditWorkerInfo.WorkCardFlowID || ''
                });
            }
        });
    }
    handleReEdit() {
        this.setState({
            successVisiable: false
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <div className="ivy-page-title">
                    <h1>工牌审核({this.props.unAuditCount || 0}个未审核)</h1>
                </div>
                <Card bordered={false}>
                    <Row type="flex" justify="space-around" align="middle" className="mt-8" gutter={40}>
                        <Col span={12} className="text-center" style={{ height: '400px' }}>
                            <ImageShow
                                url={this.props.examplePic} desc="工牌样例" />
                        </Col>
                        <Col span={12} className="text-center" style={{ height: '400px' }}>
                            <ImageShow
                                url={this.props.cardPic} />
                        </Col>
                    </Row>
                    {!this.state.successVisiable && <Row className="mt-16" gutter={40}>
                        <Form>
                            <Col span={12} offset={6}>
                                <Col span={24}>
                                    <FormItem {...{
                                        labelCol: { span: 4 },
                                        wrapperCol: { span: 20 }
                                    }} label="工厂名称">
                                        {this.props.auditWorkerInfo.EntName}
                                    </FormItem>
                                </Col>
                                <Col span={24}>
                                    <FormItem {...{
                                        labelCol: { span: 4 },
                                        wrapperCol: { span: 20 }
                                    }} label="姓名">
                                        {this.props.auditWorkerInfo.UserName}
                                    </FormItem>
                                </Col>
                                <Col span={24}>
                                    <FormItem {...{
                                        labelCol: { span: 4 },
                                        wrapperCol: { span: 20 }
                                    }} label="面试日期">
                                        {this.props.auditWorkerInfo.InterviewDate}
                                    </FormItem>
                                </Col>
                                <Col span={24}>
                                    <FormItem {...{
                                        labelCol: { span: 4 },
                                        wrapperCol: { span: 20 }
                                    }} label="工号">
                                        {getFieldDecorator('workerId', {
                                            rules: [
                                                {
                                                    required: true,
                                                    pattern: /^\S{1,}$/,
                                                    message: '工号必填'
                                                }
                                            ]
                                        })(<Input type="text" autoComplete="off" onPaste={(e) => e.preventDefault()} placeholder="请输入工号" />)}
                                    </FormItem>
                                </Col>
                            </Col>
                        </Form>
                    </Row>}
                    {this.state.successVisiable && <Row className="mt-16" gutter={40}>
                        <Form>
                            <Col span={24} className="mb-8">
                                <p className="font-16 color-danger text-center">请核对工牌信息</p>
                            </Col>
                            <Col span={12} offset={6}>
                                <Col span={24}>
                                    <FormItem {...{
                                        labelCol: { span: 4 },
                                        wrapperCol: { span: 20 }
                                    }} label="工厂名称">
                                        {this.props.auditWorkerInfo.EntName}
                                    </FormItem>
                                </Col>
                                <Col span={24}>
                                    <FormItem {...{
                                        labelCol: { span: 4 },
                                        wrapperCol: { span: 20 }
                                    }} label="姓名">
                                        {this.props.auditWorkerInfo.UserName}
                                    </FormItem>
                                </Col>
                                <Col span={24}>
                                    <FormItem {...{
                                        labelCol: { span: 4 },
                                        wrapperCol: { span: 20 }
                                    }} label="面试日期">
                                        {this.props.auditWorkerInfo.InterviewDate}
                                    </FormItem>
                                </Col>
                                <Col span={24}>
                                    <FormItem {...{
                                        labelCol: { span: 4 },
                                        wrapperCol: { span: 20 }
                                    }} label="工号">
                                        {getFieldDecorator('r_workerId', {
                                            rules: [
                                                {
                                                    required: true,
                                                    pattern: /^\S{1,}$/,
                                                    message: '工号必填'
                                                }
                                            ]
                                        })(<Input type="text" autoComplete="off" onPaste={(e) => e.preventDefault()} placeholder="请输入工号" />)}
                                    </FormItem>
                                </Col>
                            </Col>
                        </Form>
                    </Row>}
                    {!this.state.successVisiable && <Row className="mt-16 text-center">
                        <Button type="danger" htmlType="button" onClick={this.handleNoPass.bind(this)}>不通过</Button>
                        <Button type="primary" htmlType="button" className="ml-8" onClick={this.handlePass.bind(this)}>通过</Button>
                    </Row>}
                    {this.state.successVisiable && <Row className="mt-16 text-center">
                        <Button type="danger" htmlType="button" onClick={this.handleReEdit.bind(this)}>返回重新编辑</Button>
                        <Button type="primary" htmlType="button" className="ml-8" onClick={this.handleConfirmPass.bind(this)}>确定</Button>
                    </Row>}
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
                                    <Option value="2">不是工牌照片</Option>
                                    <Option value="3">不是本人工牌</Option>
                                    <Option value="4">不是该企业工牌</Option>
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
            workderId: props.workerId,
            r_workerId: props.r_workerId,
            noPassReason: props.noPassReason
        };
    },
    onFieldsChange: (props, fields) => {
        setParams('state_audit_workerCard_operate', fields);
    }
})(WorkerCardContainer);
