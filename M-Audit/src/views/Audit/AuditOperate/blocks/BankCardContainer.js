import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import {Card, Row, Col, Button, Icon, Form, Input, Modal, Select, message} from 'antd';
import setParams from 'ACTION/setParams';
import ImageShow from 'COMPONENT/ImageShow';
import AuditOperateAction from 'ACTION/Audit/AuditOperateAction';
import getEnumMap from 'CONFIG/getEnumMap';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetState from 'ACTION/resetState';
import getClient from 'COMPONENT/AliyunUpload/getClient';
import uploadRule from 'CONFIG/uploadRule';

const {
    getBankCardUnAuditRecord,
    getBankCardUnAuditCount,
    auditBankCard
} = AuditOperateAction;
const {getEnumMapByName} = getEnumMap;
const FormItem = Form.Item;
const Option = Select.Option;

class BankCardContainer extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            failedVisiable: false,
            successVisiable: false,
            bankList: []
        };
    }

    componentWillMount() {
        getEnumMapByName('BankName').then((res) => {
            this.setState({
                bankList: res
            });
        });
        if (this.props.location.lastKey !== this.props.location.key && !(this.props.location.state && this.props.location.state.clickTab)) {
            getBankCardUnAuditRecord();
            getBankCardUnAuditCount();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.getBankCardUnAuditRecordFetch.status === 'success') {
            setFetchStatus('state_audit_bankCard_operate', 'getBankCardUnAuditRecordFetch', 'close');
            let data = nextProps.auditBankCardInfo;
            if (data && data.AuditFlowID) {
                getClient(uploadRule.bankCardPic).then((client) => {
                    setParams('state_audit_bankCard_operate', {
                        bankCardPic: data.PicPath ? client.signatureUrl(data.PicPath) : ''
                    });
                });
                nextProps.form.setFields({
                    bankId: {
                        value: data.BankID ? data.BankID.toString() : undefined
                    },
                    bankCardNum: {
                        value: data.AccountNum.replace(/ /g, '')
                    }
                });
            } else {
                Modal.info({
                    title: '温馨提示',
                    content: '暂无待审核记录'
                });
            }
        }
        if (nextProps.getBankCardUnAuditRecordFetch.status === 'error') {
            setFetchStatus('state_audit_bankCard_operate', 'getBankCardUnAuditRecordFetch', 'close');
            Modal.error({
                title: window.errorTitle.normal,
                content: nextProps.getBankCardUnAuditRecordFetch.response.Desc
            });
        }
        if (nextProps.auditBankCardFetch.status === 'error') {
            setFetchStatus('state_audit_bankCard_operate', 'auditBankCardFetch', 'close');
            Modal.error({
                title: window.errorTitle.normal,
                content: nextProps.auditBankCardFetch.response.Desc
            });
        }
        if (nextProps.auditBankCardFetch.status === 'success') {
            setFetchStatus('state_audit_bankCard_operate', 'auditBankCardFetch', 'close');
            message.success('审核操作成功');
            resetState('state_audit_bankCard_operate');
            this.setState({
                failedVisiable: false,
                successVisiable: false
            });
            getBankCardUnAuditRecord();
            getBankCardUnAuditCount();
        }
    }

    handleNoPass() {
        this.setState({
            failedVisiable: true
        });
    }

    handlePass() {
        this.props.form.validateFieldsAndScroll(['bankId', 'bankCardNum'], (errors, values) => {
            if (!errors) {
                let _bcNum = (this.props.bankCardNum.value || '').replace(/\s/g, '');
                if (this.props.auditBankCardInfo && this.props.auditBankCardInfo.IsOCR === 1) {
                    auditBankCard({
                        AccountNum: _bcNum,
                        AuditFlowID: this.props.auditBankCardInfo.AuditFlowID,
                        AuditStatus: 3,
                        BankID: this.props.bankId.value ? parseInt(this.props.bankId.value, 10) : 0
                    });
                } else {
                    this.setState({
                        successVisiable: true
                    });
                    setParams('state_audit_bankCard_operate', {
                        r_bankId: {
                            value: this.props.bankId.value
                        },
                        r_bankCardNum: {
                            value: ''
                        }
                    });
                }
            }
        });

    }

    handleFailedOk() {
        this.props.form.validateFieldsAndScroll(['noPassReason'], (errors, values) => {
            if (!errors) {
                // TODO api
                auditBankCard({
                    AccountNum: this.props.bankCardNum.value || '',
                    AuditFlowID: this.props.auditBankCardInfo.AuditFlowID,
                    AuditStatus: 4,
                    BankID: this.props.bankId.value ? parseInt(this.props.bankId.value, 10) : 0,
                    Remarks: this.props.noPassReason.value ? parseInt(this.props.noPassReason.value, 10) : ''
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
        this.props.form.validateFieldsAndScroll(['r_bankId', 'r_bankCardNum'], (errors, values) => {
            if (!errors) {
                let _bcNum = (this.props.bankCardNum.value || '').replace(/\s/g, '');
                let _r_bcNum = (this.props.r_bankCardNum.value || '').replace(/\s/g, '');
                if (this.props.bankId.value !== this.props.r_bankId.value || _bcNum !== _r_bcNum) {
                    Modal.error({
                        title: '输入错误',
                        content: '请仔细核对输入的银行卡号',
                        okText: '立即重新输入',
                        onOk: () => {
                            this.setState({
                                successVisiable: false
                            });
                        }
                    });
                    return false;
                }
                // TODO api
                auditBankCard({
                    AccountNum: _bcNum,
                    AuditFlowID: this.props.auditBankCardInfo.AuditFlowID,
                    AuditStatus: 3,
                    BankID: this.props.bankId.value ? parseInt(this.props.bankId.value, 10) : ''
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
        const {getFieldDecorator} = this.props.form;
        return (
            <div>
                <div className="ivy-page-title">
                    <h1>银行卡审核({this.props.unAuditCount || 0}个未审核)</h1>
                </div>
                <Card bordered={false}>
                    <Row>
                        {this.props.auditBankCardInfo.IsOCR === 1 &&
                        <h3 style={{fontSize: '18px'}} className="text-center">该结果为OCR识别，请核对</h3>}
                    </Row>
                    <Row type="flex" justify="space-around" align="middle" className="mt-8">
                        <Col span={12} className="text-center" style={{height: '400px'}}>
                            <ImageShow
                                url={this.props.bankCardPic}/>
                        </Col>
                    </Row>
                    {!this.state.successVisiable && <Row className="mt-16" gutter={40}>
                        <Form>
                            <Col span={12} offset={6}>
                                <Col span={24}>
                                    <FormItem {...{
                                        labelCol: {span: 4},
                                        wrapperCol: {span: 20}
                                    }} label="银行名称">
                                        {getFieldDecorator('bankId', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '银行名称必选'
                                                }
                                            ]
                                        })(<Select placeholder="请选择银行">
                                            {
                                                this.state.bankList.map((item, i) => {
                                                    return (
                                                        <Option key={item.EnumValue.toString()}
                                                                value={item.EnumValue.toString()}>{item.EnumDesc}</Option>
                                                    );
                                                })
                                            }
                                        </Select>)}
                                    </FormItem>
                                </Col>
                                <Col span={24}>
                                    <FormItem {...{
                                        labelCol: {span: 4},
                                        wrapperCol: {span: 20}
                                    }} label="银行卡号">
                                        {getFieldDecorator('bankCardNum', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '银行卡号必填'
                                                },
                                                {
                                                    validator: function (rule, value, cb) {
                                                        const _value = (value || '').replace(/\s/g, '');
                                                        if (!/^([1-9]{1})(\d{15}|\d{17}|\d{18})$/.test(_value)) {
                                                            cb('请填写正确的16/18/19位银行卡号');
                                                        }
                                                        cb();
                                                    }
                                                }
                                            ]
                                        })(<Input autoComplete="off" onPaste={(e) => e.preventDefault()} type="text"
                                                  placeholder="银行卡号"/>)}
                                    </FormItem>
                                </Col>
                            </Col>
                        </Form>
                    </Row>}
                    {this.state.successVisiable && <Row className="mt-16" gutter={40}>
                        <Form>
                            <Col span={24} className="mb-8">
                                <p className="font-16 color-danger text-center">请再次输入银行卡号，并核对银行名称</p>
                            </Col>
                            <Col span={12} offset={6}>
                                <Col span={24}>
                                    <FormItem {...{
                                        labelCol: {span: 4},
                                        wrapperCol: {span: 20}
                                    }} label="银行名称">
                                        {getFieldDecorator('r_bankId', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '银行名称必选'
                                                }
                                            ]
                                        })(<Select placeholder="请选择银行">
                                            {
                                                this.state.bankList.map((item, i) => {
                                                    return (
                                                        <Option key={item.EnumValue.toString()}
                                                                value={item.EnumValue.toString()}>{item.EnumDesc}</Option>
                                                    );
                                                })
                                            }
                                        </Select>)}
                                    </FormItem>
                                </Col>
                                <Col span={24}>
                                    <FormItem {...{
                                        labelCol: {span: 4},
                                        wrapperCol: {span: 20}
                                    }} label="银行卡号">
                                        {getFieldDecorator('r_bankCardNum', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '银行卡号必填'
                                                },
                                                {
                                                    validator: function (rule, value, cb) {
                                                        const _value = (value || '').replace(/\s/g, '');
                                                        if (!/^([1-9]{1})(\d{15}|\d{17}|\d{18})$/.test(_value)) {
                                                            cb('请填写正确的16/18/19位银行卡号');
                                                        }
                                                        cb();
                                                    }
                                                }
                                            ]
                                        })(<Input autoComplete="off" onPaste={(e) => e.preventDefault()} type="text"
                                                  placeholder="银行卡号"/>)}
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
                        <Button type="primary" htmlType="button" className="ml-8"
                                onClick={this.handleConfirmPass.bind(this)}>确定</Button>
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
                                labelCol: {span: 6},
                                wrapperCol: {span: 18}
                            }} label="不通过原因">
                                {getFieldDecorator('noPassReason', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '不通过原因必填'
                                        }
                                    ]
                                })(<Select placeholder="请选择不通过原因" className="w-100" allowClear={true}>
                                    <Option value="1">非银行卡</Option>
                                    <Option value="2">不清晰</Option>
                                    <Option value="3">不是储蓄卡</Option>
                                    <Option value="4">不支持该银行</Option>
                                </Select>)}
                            </FormItem>
                        </Col>
                    </Row>

                </Modal>
            </div>
        );
    }
}

export default Form.create({
    mapPropsToFields: (props) => {
        return {
            bankId: props.bankId,
            r_bankId: props.r_bankId,
            bankCardNum: props.bankCardNum,
            r_bankCardNum: props.r_bankCardNum,
            noPassReason: props.noPassReason
        };
    },
    onFieldsChange: (props, fields) => {
        setParams('state_audit_bankCard_operate', fields);
    }
})(BankCardContainer);
