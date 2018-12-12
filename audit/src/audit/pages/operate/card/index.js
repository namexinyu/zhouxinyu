import React from 'react';
import {Card, Row, Col, Button, Form, message} from 'antd';
import NationList from 'AUDIT_CONFIG/NationList';
import VerifyIdentity from 'AUDIT_UTILS/VerifyIdentity';
const FormItem = Form.Item;
export default class extends React.Component {

    componentDidMount() {

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
                                                    message: '会员姓名必填'
                                                }
                                            ]
                                        })(<Input autoComplete="off" type="text" placeholder="会员姓名"/>)}
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem {...{
                                        labelCol: {span: 9},
                                        wrapperCol: {span: 15}
                                    }} label="民族">
                                        {getFieldDecorator('userNation', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '民族必填'
                                                }
                                            ]
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
                                        {getFieldDecorator('userAddress', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '身份证住址必填'
                                                }
                                            ]
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
                                        })(<Input autoComplete="off" type="text" placeholder="身份证号码"/>)}
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem {...{
                                        labelCol: {span: 9},
                                        wrapperCol: {span: 15}
                                    }} label="有效期限">
                                        {getFieldDecorator('limitDate', {
                                            rules: [
                                                {
                                                    required: !this.props.lts,
                                                    message: '有效期限必填'
                                                }
                                            ]
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
                                        {getFieldDecorator('assuedOffice', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '签发机关必填'
                                                }
                                            ]
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
                                                    message: '会员姓名必填'
                                                }
                                            ]
                                        })(<Input autoComplete="off" type="text" placeholder="会员姓名"/>)}
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem {...{
                                        labelCol: {span: 9},
                                        wrapperCol: {span: 15}
                                    }} label="民族">
                                        {getFieldDecorator('r_userNation', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '民族必填'
                                                }
                                            ]
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
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '身份证住址必填'
                                                }
                                            ]
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
                                        })(<Input autoComplete="off" type="text" placeholder="身份证号码"/>)}
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem {...{
                                        labelCol: {span: 9},
                                        wrapperCol: {span: 15}
                                    }} label="有效期限">
                                        {getFieldDecorator('r_limitDate', {
                                            rules: [
                                                {
                                                    required: !this.props.r_lts,
                                                    message: '有效期限必填'
                                                }
                                            ]
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
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '签发机关必填'
                                                }
                                            ]
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