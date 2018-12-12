import {Modal, Form, Row, Col, Input, message} from 'antd';
import React from 'react';
import regexRule from 'UTIL/constant/regexRule';
import BillService from 'SERVICE/ExpCenter/BillService';
import {DataTransfer, ParamTransfer} from 'UTIL/base/CommonUtils';

const FormItem = Form.Item;

class BillEditModal extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    handleModalCancel() {
        this.props.onModalClose();
    }

    handleModalConfirm() {
        this.props.form.validateFieldsAndScroll((errors, values) => {
            if (!errors) {
                let param = {
                    BillDate: this.props.BillDate,
                    HubID: this.props.HubID
                };
                Object.keys(values).forEach((key) => {
                    param[key] = values[key] * 100;
                });
                BillService.editBillData(param)
                    .then(
                        (res) => {
                            if (!res || res.error) return;
                            if (res.Code === 0) {
                                message.destroy();
                                message.info('修改成功');
                                this.handleModalCancel();
                            } else {
                                message.destroy();
                                message.info('修改失败' + (res.Desc ? ':' + res.Desc : ''));
                            }
                        }, (err) => {
                            message.destroy();
                            message.info('修改失败' + (err && err.Desc ? ':' + err.Desc : ''));
                        }
                    );
            }
        });
    }

    render() {
        const fLayout = {
            labelCol: {span: 8},
            wrapperCol: {span: 16}
        };
        const {getFieldDecorator} = this.props.form;
        const _rule = [{required: true, pattern: regexRule.money, message: '请输入正确的金额'}];
        return (
            <Modal title="修改收退费账目"
                   onOk={() => this.handleModalConfirm()}
                   onCancel={() => this.handleModalCancel()}
                   OKTEXT="提交"
                   visible={true}>
                <Form>
                    <Row>
                        <Col span={12}>
                            <FormItem {...fLayout} label="实收">
                                {getFieldDecorator('AmountReal',
                                    {rules: _rule, initialValue: DataTransfer.money(this.props.AmountReal, 2)})(
                                    <Input placeholder="" addonAfter="元"/>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...fLayout} label="实退">
                                {getFieldDecorator('RefundAmountReal',
                                    {rules: _rule, initialValue: DataTransfer.money(this.props.RefundAmountReal, 2)})(
                                    <Input placeholder="" addonAfter="元"/>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row className="mb-16">
                        <div style={{fontSize: '15px'}}>收款金额</div>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem {...fLayout} label="微信">
                                {getFieldDecorator('PayWeiXin',
                                    {rules: _rule, initialValue: DataTransfer.money(this.props.PayWeiXin, 2)})(
                                    <Input placeholder="" addonAfter="元"/>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...fLayout} label="支付宝">
                                {getFieldDecorator('PayAliPay',
                                    {rules: _rule, initialValue: DataTransfer.money(this.props.PayAliPay, 2)})(
                                    <Input placeholder="" addonAfter="元"/>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem {...fLayout} label="现金">
                                {getFieldDecorator('PayCash',
                                    {rules: _rule, initialValue: DataTransfer.money(this.props.PayCash, 2)})(
                                    <Input placeholder="" addonAfter="元"/>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...fLayout} label="银行转账">
                                {getFieldDecorator('PayBank',
                                    {rules: _rule, initialValue: DataTransfer.money(this.props.PayBank, 2)})(
                                    <Input placeholder="" addonAfter="元"/>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem {...fLayout} label="差额">
                                {getFieldDecorator('Balance',
                                    {rules: _rule, initialValue: DataTransfer.money(this.props.Balance, 2)})(
                                    <Input placeholder="" addonAfter="元"/>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        );
    }

}

export default Form.create()(BillEditModal);