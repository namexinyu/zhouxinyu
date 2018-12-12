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

const IsSettleOrderModal = Form.create({
    mapPropsToFields: props => ({...props.IsSettleOrderModalItem}),
    onFieldsChange: (props, fields) => props.setParams('IsSettleOrderModalItem', fields)
})(({form, IsSettleOrderModalItem, handleModalCancel, handleModalSubmit}) => {
    const {getFieldDecorator} = form;
    const formItemLayout = {labelCol: {span: 5}, wrapperCol: {span: 18}};
    return (
        <Modal
            title="手工结算" visible={IsSettleOrderModalItem.Visible}
            onCancel={handleModalCancel} confirmLoading={IsSettleOrderModalItem.confirmLoading}
            onOk={() => {
                form.validateFields((err, fieldsValue) => {
                    if (err) return;
                    handleModalSubmit(fieldsValue);
                });
            }}>
            <Form>
                <FormItem label={
                    <div>
                        <Icon type="info-circle-o" className='color-warning mr-8 font-18'/>
                    </div>
                } {...formItemLayout} colon={false}>
                    <div>
                        <div className="font-14">请注意!</div>
                        <div style={{lineHeight: '18px'}}>
                            <div>正常订单：{IsSettleOrderModalItem.Count.a || 0}</div>
                            <div>少返订单：{IsSettleOrderModalItem.Count.b || 0}</div>
                            <div>未结完订单：{IsSettleOrderModalItem.Count.c || 0}</div>
                        </div>
                    </div>
                </FormItem>
                <FormItem label="是否结算" {...formItemLayout}>
                    {getFieldDecorator('SettleStatus', {
                        rules: [{required: true}, {
                            validator: (rule, value, cb) => (value == -9999 ? cb(true) : cb()),
                            message: '请选择是否结算'
                        }],
                        initialValue: '-9999'
                    })(<Select>
                            <Select.Option value="-9999">请选择</Select.Option>
                            <Select.Option value="1">待结算</Select.Option>
                            <Select.Option value="2">已结算</Select.Option>
                        </Select>
                    )}
                </FormItem>
            </Form>
        </Modal>
    );
});

export default IsSettleOrderModal;