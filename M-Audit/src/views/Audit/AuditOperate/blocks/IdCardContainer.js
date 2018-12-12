import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import {Card, Row, Col, Button, Icon, Form, Input, Modal, Select, Cascader, message, DatePicker, Checkbox} from 'antd';
import setParams from 'ACTION/setParams';
import ImageShow from 'COMPONENT/ImageShow';
import getAntAreaOptions from 'CONFIG/antAreaOptions';
import AuditOperateAction from 'ACTION/Audit/AuditOperateAction';
import setFetchStatus from 'ACTION/setFetchStatus';
import getPCA from 'CONFIG/getPCA';
import NationList from 'CONFIG/NationList';
import moment from 'moment';
import resetState from 'ACTION/resetState';
import getClient from 'COMPONENT/AliyunUpload/getClient';
import uploadRule from 'CONFIG/uploadRule';
import VerifyIdentity from 'UTIL/base/VerifyIdentity';

const {
    getIdCardUnAuditRecord,
    getIdCardUnAuditCount,
    auditIdCard
} = AuditOperateAction;
const FormItem = Form.Item;
const Option = Select.Option;

class IdCardContainer extends React.PureComponent {
    constructor(props) {
        super(props);
        this.antOptions = getAntAreaOptions;
        this.state = {
            failedVisiable: false,
            successVisiable: false
        };
    }

    componentWillMount() {
        if (this.props.location.lastKey !== this.props.location.key && !(this.props.location.state && this.props.location.state.clickTab)) {
            getIdCardUnAuditRecord();
            getIdCardUnAuditCount();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.getIdCardUnAuditRecordFetch.status === 'success') {
            setFetchStatus('state_audit_idCard_operate', 'getIdCardUnAuditRecordFetch', 'close');
            if (nextProps.getIdCardUnAuditRecordFetch.response.Data == null) {
                Modal.info({
                    title: '温馨提示',
                    content: '暂无待审核记录'
                });
            } else {
                let data = nextProps.sourceUserInfo;
                getClient(uploadRule.idCardPic).then((client) => {
                    setParams('state_audit_idCard_operate', {
                        idCard1: data.IDCardPicPathFront ? client.signatureUrl(data.IDCardPicPathFront) : '',
                        idCard2: data.IDCardPicPathBack ? client.signatureUrl(data.IDCardPicPathBack) : ''
                    });
                });
                nextProps.form.setFields({
                    userAddress: {
                        value: data.Address
                    },
                    idCardNum: {
                        value: data.IDCardNum
                    },
                    userName: {
                        value: data.RealName
                    },
                    userNation: {
                        value: data.Native ? data.Native.toString() : undefined
                    },
                    areaCode: {
                        value: getPCA.getPCACode(data.AreaCode)
                    },
                    assuedOffice: {
                        value: data.SignDepart
                    },
                    limitDate: {
                        value: new Date(data.ValidateDate).toDateString() === 'Invalid Date' ? undefined : moment(data.ValidateDate, 'YY-MM-DD')
                    }
                });
            }
        }
        if (nextProps.getIdCardUnAuditRecordFetch.status === 'error') {
            setFetchStatus('state_audit_idCard_operate', 'getIdCardUnAuditRecordFetch', 'close');
            Modal.error({
                title: window.errorTitle.normal,
                content: nextProps.getIdCardUnAuditRecordFetch.response.Desc
            });
        }
        if (nextProps.auditIdCardFetch.status === 'error') {
            setFetchStatus('state_audit_idCard_operate', 'auditIdCardFetch', 'close');
            Modal.error({
                title: window.errorTitle.normal,
                content: nextProps.auditIdCardFetch.response.Desc
            });
        }
        if (nextProps.auditIdCardFetch.status === 'success') {
            setFetchStatus('state_audit_idCard_operate', 'auditIdCardFetch', 'close');
            message.success('审核操作成功');
            resetState('state_audit_idCard_operate');
            this.setState({
                failedVisiable: false,
                successVisiable: false
            });
            getIdCardUnAuditRecord();
            getIdCardUnAuditCount();
        }
    }

    handleNoPass() {
        this.setState({
            failedVisiable: true
        });
    }

    handlePass() {
        this.props.form.validateFieldsAndScroll(['userName', 'userNation', 'areaCode', 'userAddress', 'idCardNum', 'limitDate', 'assuedOffice', 'lts'], (errors, values) => {
            if (!errors) {
                if (this.props.sourceUserInfo.IsOCR && this.props.sourceUserInfo.IsOCR === 1) {
                    auditIdCard({
                        AreaCode: this.props.areaCode.value && this.props.areaCode.value[2] || '',
                        Address: this.props.userAddress.value || '',
                        AuditStatus: 3,
                        CertFlowID: this.props.sourceUserInfo.CertFlowID,
                        IDCardNum: this.props.idCardNum.value || '',
                        Native: this.props.userNation.value ? parseInt(this.props.userNation.value, 10) : 0,
                        RealName: this.props.userName.value || '',
                        SignDepart: this.props.assuedOffice.value || '',
                        ValidateDate: this.props.lts ? '2199-01-01' : (this.props.limitDate.value && moment(this.props.limitDate.value).isValid()) ? this.props.limitDate.value.format('YYYY-MM-DD') : ''
                    });
                } else {
                    this.setState({
                        successVisiable: true
                    });
                    setParams('state_audit_idCard_operate', {
                        r_userName: {
                            value: this.props.userName.value
                        },
                        r_userAddress: this.props.userAddress,
                        r_areaCode: this.props.areaCode,
                        r_userNation: this.props.userNation,
                        r_idCardNum: {
                            value: ''
                        },
                        r_limitDate: this.props.limitDate,
                        r_assuedOffice: this.props.assuedOffice,
                        r_lts: this.props.lts
                    });
                }

            }
        });
    }

    handleFailedOk() {
        this.props.form.validateFieldsAndScroll(['noPassReason'], (errors, values) => {
            if (!errors) {
                // TODO audit failed api
                auditIdCard({
                    AreaCode: this.props.areaCode.value && this.props.areaCode.value[2] || '',
                    Address: this.props.userAddress.value || '',
                    CertAuditFailReason: this.props.noPassReason.value ? parseInt(this.props.noPassReason.value, 10) : 0,
                    AuditStatus: 4,
                    CertFlowID: this.props.sourceUserInfo.CertFlowID,
                    IDCardNum: this.props.idCardNum.value || '',
                    Native: this.props.userNation.value ? parseInt(this.props.userNation.value, 10) : 0,
                    RealName: this.props.userName.value || '',
                    SignDepart: this.props.assuedOffice.value || '',
                    ValidateDate: this.props.lts ? '2199-01-01' : (this.props.limitDate.value && moment(this.props.limitDate.value).isValid()) ? this.props.limitDate.value.format('YYYY-MM-DD') : ''
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
        this.props.form.validateFieldsAndScroll(['r_userName', 'r_userNation', 'r_areaCode', 'r_userAddress', 'r_idCardNum', 'r_limitDate', 'r_assuedOffice', 'r_lts'], (errors, values) => {
            if (!errors) {
                if (this.props.userName.value !== this.props.r_userName.value || this.props.idCardNum.value !== this.props.r_idCardNum.value) {
                    Modal.error({
                        title: '输入错误',
                        content: '请仔细核对输入的姓名和身份证号码。两次输入不一致，请重新输入',
                        okText: '立即重新输入',
                        onOk: () => {
                            this.setState({
                                successVisiable: false
                            });
                        }
                    });
                    return false;
                }
                // TODO audit api
                auditIdCard({
                    AreaCode: this.props.areaCode.value && this.props.areaCode.value[2] || '',
                    Address: this.props.userAddress.value || '',
                    AuditStatus: 3,
                    CertFlowID: this.props.sourceUserInfo.CertFlowID,
                    IDCardNum: this.props.idCardNum.value || '',
                    Native: this.props.userNation.value ? parseInt(this.props.userNation.value, 10) : 0,
                    RealName: this.props.userName.value || '',
                    SignDepart: this.props.assuedOffice.value || '',
                    ValidateDate: this.props.lts ? '2199-01-01' : (this.props.limitDate.value && moment(this.props.limitDate.value).isValid()) ? this.props.limitDate.value.format('YYYY-MM-DD') : ''
                });
            }
        });
    }

    handleReEdit() {
        this.setState({
            successVisiable: false
        });
    }

    handleChangeLts(e) {
        setParams('state_audit_idCard_operate', {
            lts: e.target.checked,
            limitDate: {}
        });
    }

    handleChangeRLts(e) {
        setParams('state_audit_idCard_operate', {
            r_lts: e.target.checked,
            limitDate: {}
        });
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <div>
                <div className="ivy-page-title">
                    <h1>身份证审核({this.props.unAuditCount || 0}个未审核)</h1>
                </div>
                <Card bordered={false}>
                    <Row>
                        {this.props.sourceUserInfo && this.props.sourceUserInfo.IsOCR === 1 &&
                        <h3 style={{fontSize: '18px'}} className="text-center">该结果为OCR识别，请核对</h3>}
                    </Row>
                    <Row type="flex" justify="space-around" align="middle" className="mt-8" gutter={40}>
                        <Col span={12} className="text-center" style={{height: '400px'}}>
                            <ImageShow
                                url={this.props.idCard1}/>
                        </Col>
                        <Col span={12} className="text-center" style={{height: '400px'}}>
                            <ImageShow
                                url={this.props.idCard2}/>
                        </Col>
                    </Row>
                    {!this.state.successVisiable && <Row className="mt-16" gutter={40}>
                        <Form>
                            <Col span={18} offset={3}>
                                <Col span={8}>
                                    <FormItem {...{
                                        labelCol: {span: 9},
                                        wrapperCol: {span: 15}
                                    }} label="姓名">
                                        {getFieldDecorator('userName', {
                                            rules: [
                                                {
                                                    required: true,
                                                    pattern: /^\S{1,}$/,
                                                    message: '请填写正确的名称'
                                                }
                                            ]
                                        })(<Input autoComplete="off" type="text" onPaste={(e) => e.preventDefault()}
                                                  placeholder="会员姓名"/>)}
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem {...{
                                        labelCol: {span: 9},
                                        wrapperCol: {span: 15}
                                    }} label="民族">
                                        {/* {required: true, message: '民族必填'}*/}
                                        {getFieldDecorator('userNation', {
                                            rules: []
                                        })(<Select>
                                            {
                                                NationList.map((item, i) => {
                                                    return (
                                                        <Option key={(i + 1).toString()}
                                                                value={(i + 1).toString()}>{item}</Option>
                                                    );
                                                })
                                            }
                                        </Select>)}
                                    </FormItem>
                                </Col>
                                <Col span={24}>
                                    <FormItem {...{
                                        labelCol: {span: 3},
                                        wrapperCol: {span: 21}
                                    }} label="所属地区">
                                        {getFieldDecorator('areaCode', {
                                            rules: []
                                        })(<Cascader options={this.antOptions} placeholder="请选择省/市/区" changeOnSelect/>)}
                                    </FormItem>
                                </Col>
                                <Col span={24}>
                                    <FormItem {...{
                                        labelCol: {span: 3},
                                        wrapperCol: {span: 21}
                                    }} label="身份证住址">
                                        {/* {required: true, message: '身份证住址必填'}*/}
                                        {getFieldDecorator('userAddress', {
                                            rules: []
                                        })(<Input autoComplete="off" type="text" placeholder="身份证住址"/>)}
                                    </FormItem>
                                </Col>
                                <Col span={24}>
                                    <FormItem {...{
                                        labelCol: {span: 3},
                                        wrapperCol: {span: 21}
                                    }} label="身份证号码">
                                        {getFieldDecorator('idCardNum', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '身份证号码必填'
                                                },
                                                {
                                                    validator: function (errors, value, cb) {
                                                        if (!VerifyIdentity(value)) {
                                                            cb('身份证号码不合法');
                                                        }
                                                        cb();
                                                    }
                                                }
                                            ]
                                        })(<Input type="text" autoComplete="off" onPaste={(e) => e.preventDefault()}
                                                  placeholder="身份证号码"/>)}
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem {...{
                                        labelCol: {span: 9},
                                        wrapperCol: {span: 15}
                                    }} label="有效期限">
                                        {/* {required: !this.props.lts, message: '有效期限必填'}*/}
                                        {getFieldDecorator('limitDate', {
                                            rules: []
                                        })(<DatePicker placeholder="请选择有效截止日期"/>)}
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem {...{
                                        labelCol: {span: 9},
                                        wrapperCol: {span: 15}
                                    }} >
                                        <Checkbox checked={this.props.lts}
                                                  onChange={this.handleChangeLts.bind(this)}>长期</Checkbox>
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem {...{
                                        labelCol: {span: 9},
                                        wrapperCol: {span: 15}
                                    }} label="签发机关">
                                        {/* {required: true, message: '签发机关必填'}*/}
                                        {getFieldDecorator('assuedOffice', {
                                            rules: []
                                        })(<Input autoComplete="off" type="text" placeholder="签发机关"/>)}
                                    </FormItem>
                                </Col>
                            </Col>
                        </Form>
                    </Row>}
                    {this.state.successVisiable && <Row className="mt-16" gutter={40}>
                        <Form>
                            <Col span={18} offset={3}>
                                <Col span={8}>
                                    <FormItem {...{
                                        labelCol: {span: 9},
                                        wrapperCol: {span: 15}
                                    }} label="姓名">
                                        {getFieldDecorator('r_userName', {
                                            rules: [
                                                {
                                                    required: true,
                                                    pattern: /^\S{1,}$/,
                                                    message: '请填写正确的名称'
                                                }
                                            ]
                                        })(<Input autoComplete="off" onPaste={(e) => e.preventDefault()} type="text"
                                                  placeholder="会员姓名"/>)}
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem {...{
                                        labelCol: {span: 9},
                                        wrapperCol: {span: 15}
                                    }} label="民族">
                                        {getFieldDecorator('r_userNation', {
                                            rules: []
                                        })(<Select>
                                            {
                                                NationList.map((item, i) => {
                                                    return (
                                                        <Option key={(i + 1).toString()}
                                                                value={(i + 1).toString()}>{item}</Option>
                                                    );
                                                })
                                            }
                                        </Select>)}
                                    </FormItem>
                                </Col>
                                <Col span={24}>
                                    <FormItem {...{
                                        labelCol: {span: 3},
                                        wrapperCol: {span: 21}
                                    }} label="所属地区">
                                        {getFieldDecorator('r_areaCode', {
                                            rules: []
                                        })(<Cascader options={this.antOptions} placeholder="请选择省/市/区" changeOnSelect/>)}
                                    </FormItem>
                                </Col>
                                <Col span={24}>
                                    <FormItem {...{
                                        labelCol: {span: 3},
                                        wrapperCol: {span: 21}
                                    }} label="身份证住址">
                                        {getFieldDecorator('r_userAddress', {
                                            rules: []
                                        })(<Input autoComplete="off" type="text" placeholder="身份证住址"/>)}
                                    </FormItem>
                                </Col>
                                <Col span={24}>
                                    <FormItem {...{
                                        labelCol: {span: 3},
                                        wrapperCol: {span: 21}
                                    }} label="身份证号码">
                                        {getFieldDecorator('r_idCardNum', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '身份证号码必填'
                                                },
                                                {
                                                    validator: function (errors, value, cb) {
                                                        if (!VerifyIdentity(value)) {
                                                            cb('身份证号码不合法');
                                                        }
                                                        cb();
                                                    }
                                                }
                                            ]
                                        })(<Input autoComplete="off" onPaste={(e) => e.preventDefault()} type="text"
                                                  placeholder="身份证号码"/>)}
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem {...{
                                        labelCol: {span: 9},
                                        wrapperCol: {span: 15}
                                    }} label="有效期限">
                                        {getFieldDecorator('r_limitDate', {
                                            rules: []
                                        })(<DatePicker placeholder="请选择有效截止日期"/>)}
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem {...{
                                        labelCol: {span: 9},
                                        wrapperCol: {span: 15}
                                    }} >
                                        <Checkbox checked={this.props.r_lts}
                                                  onChange={this.handleChangeRLts.bind(this)}>长期</Checkbox>
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem {...{
                                        labelCol: {span: 9},
                                        wrapperCol: {span: 15}
                                    }} label="签发机关">
                                        {getFieldDecorator('r_assuedOffice', {
                                            rules: []
                                        })(<Input autoComplete="off" type="text" placeholder="签发机关"/>)}
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
                                    <Option value="1">非身份证</Option>
                                    <Option value="2">不清晰</Option>
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
            userName: props.userName,
            userNation: props.userNation,
            areaCode: props.areaCode,
            userAddress: props.userAddress,
            idCardNum: props.idCardNum,
            limitDate: props.limitDate,
            assuedOffice: props.assuedOffice,
            r_userName: props.r_userName,
            r_userNation: props.r_userNation,
            r_areaCode: props.r_areaCode,
            r_userAddress: props.r_userAddress,
            r_idCardNum: props.r_idCardNum,
            r_limitDate: props.r_limitDate,
            r_assuedOffice: props.r_assuedOffice,
            noPassReason: props.noPassReason
        };
    },
    onFieldsChange: (props, fields) => {
        setParams('state_audit_idCard_operate', fields);
    }
})(IdCardContainer);
