import React from 'react';

import {
    Row,
    Col,
    Card,
    Form,
    Input,
    Alert,
    Table,
    Icon,
    Button,
    DatePicker,
    message,
    Radio,
    Select,
    Modal,
    Popconfirm
} from 'antd';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const {TextArea} = Input;


const SetOrderStatusModal = Form.create({
    mapPropsToFields: props => ({...props.SetOrderStatusModalItem}),
    onFieldsChange: (props, fields) => props.setParams('SetOrderStatusModalItem', fields)
})(({form, SetOrderStatusModalItem, handleModalCancel, handleModalSubmit}) => {
    const {getFieldDecorator} = form;
    const formItemLayout = {labelCol: {span: 5}, wrapperCol: {span: 18}};
    return (
        <Modal
            title="订单状态" visible={SetOrderStatusModalItem.Visible}
            onCancel={handleModalCancel} confirmLoading={SetOrderStatusModalItem.confirmLoading}
            onOk={() => {
                form.validateFields((err, fieldsValue) => {
                    if (err) return;
                    handleModalSubmit(fieldsValue);
                });
            }}>
            <Form>
                <FormItem label="订单状态" {...formItemLayout}>
                    {getFieldDecorator('OrderStep', {
                        rules: [{required: true}, {
                            validator: (rule, value, cb) => (value == -9999 ? cb(true) : cb()),
                            message: '请选择是否结算'
                        }],
                        initialValue: '-9999'
                    })(
                        <RadioGroup>
                            <Radio value='32'>作废</Radio>
                            <Radio value='29'>未结完</Radio>
                            <Radio value='30'>少返</Radio>
                            <Radio value='31'>呆账</Radio>
                            <Radio value='26'>正常</Radio>
                        </RadioGroup>
                    )}
                </FormItem>
            </Form>
        </Modal>
    );
});

export default SetOrderStatusModal;