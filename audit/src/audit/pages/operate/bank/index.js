import React from 'react';
import {Card, Row, Col, Button, message} from 'antd';

export default class extends React.Component {

    componentDidMount() {

    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <div className="ivy-page-title">
                    <h1>银行卡审核({this.props.unAuditCount || 0}个未审核)</h1>
                </div>
                <Card bordered={false}>
                    <Row>
                        {this.props.auditBankCardInfo.IsOCR === 1 && <h3 style={{ fontSize: '18px' }} className="text-center">该结果为OCR识别，请核对</h3>}
                    </Row>
                    <Row type="flex" justify="space-around" align="middle" className="mt-8">
                        <Col span={12} className="text-center" style={{ height: '400px' }}>
                            <ImageShow
                                url={this.props.bankCardPic} />
                        </Col>
                    </Row>
                    {!this.state.successVisiable && <Row className="mt-16" gutter={40}>
                        <Form>
                            <Col span={12} offset={6}>
                                <Col span={24}>
                                    <FormItem {...{
                                        labelCol: { span: 4 },
                                        wrapperCol: { span: 20 }
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
                                                        <Option key={item.EnumValue.toString()} value={item.EnumValue.toString()}>{item.EnumDesc}</Option>
                                                    );
                                                })
                                            }
                                        </Select>)}
                                    </FormItem>
                                </Col>
                                <Col span={24}>
                                    <FormItem {...{
                                        labelCol: { span: 4 },
                                        wrapperCol: { span: 20 }
                                    }} label="银行卡号">
                                        {getFieldDecorator('bankCardNum', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '银行卡号必填'
                                                },
                                                {
                                                    validator: function (rule, value, callback) {
                                                        if (value.length !== 16 && value.length !== 18 && value.length !== 19) {
                                                            callback('银行卡号位数不对');
                                                        }
                                                        callback();
                                                    }
                                                }
                                            ]
                                        })(<Input type="text" placeholder="银行卡号" />)}
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
                                        labelCol: { span: 4 },
                                        wrapperCol: { span: 20 }
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
                                                        <Option key={item.EnumValue.toString()} value={item.EnumValue.toString()}>{item.EnumDesc}</Option>
                                                    );
                                                })
                                            }
                                        </Select>)}
                                    </FormItem>
                                </Col>
                                <Col span={24}>
                                    <FormItem {...{
                                        labelCol: { span: 4 },
                                        wrapperCol: { span: 20 }
                                    }} label="银行卡号">
                                        {getFieldDecorator('r_bankCardNum', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '银行卡号必填'
                                                },
                                                {
                                                    validator: function (rule, value, callback) {
                                                        if (value.length !== 16 && value.length !== 18 && value.length !== 19) {
                                                            callback('银行卡号位数不对');
                                                        }
                                                        callback();
                                                    }
                                                }
                                            ]
                                        })(<Input type="text" placeholder="银行卡号" />)}
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
                                    <Option value="1">非银行卡</Option>
                                    <Option value="2">不清晰</Option>
                                    <Option value="3">不是储蓄卡</Option>
                                    <Option value="4">不支持该银行</Option>
                                </Select>)}
                            </FormItem>
                        </Col>
                    </Row>

                </Modal>
            </div >
        );
    }
}