import React from 'react';
import {
    Form,
    Input,
    Modal,
    Radio,
    Select,
    Spin,
    DatePicker
} from 'antd';
import {
    ComplainStatus, ComplainStatusEnum
} from 'CONFIG/EnumerateLib/Mapping_Order';
import {
    OrderStep
} from 'CONFIG/EnumerateLib/Mapping_Order';

const {Option} = Select;
const RadioGroup = Radio.Group;
const {TextArea} = Input;
const FormItem = Form.Item;

class SetInterviewModal extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const {onCancel, afterClose, handleSetInterviewModalSubmit} = this.props;
        const {getFieldDecorator} = this.props.form;
        return (
            <Modal
                title="设置面试状态"
                visible={this.props.setInterviewModalVisible}
                onOk={(e) => {
                    e.preventDefault();
                    this.props.form.validateFields((err, fieldsValue) => {
                        console.log(err);
                        if (err) return;
                        handleSetInterviewModalSubmit && handleSetInterviewModalSubmit(fieldsValue);
                    });
                }} onCancel={onCancel}
                afterClose={() => {
                    this.props.form.resetFields();
                    afterClose();
                }}>
                <Form>
                    <FormItem label="面试状态" labelCol={{span: 5}} wrapperCol={{span: 18}}>
                        {getFieldDecorator('OrderStep', {
                            rules: [{required: true}, {
                                validator: (rule, value, cb) => (value == -9999 ? cb(true) : cb()),
                                message: '请选择面试状态'
                            }],
                            initialValue: '-9999'
                        })(<Select>
                                <Option value="-9999">请选择</Option>
                                {Object.entries(OrderStep).filter(item => [8, 9, 20].includes(Number(item[0]))).map((i) => {
                                    return <Option value={i[0].toString()} key={i[0]}>{i[1]}</Option>;
                                })}
                            </Select>
                        )}
                    </FormItem>
                    <FormItem label="备注" labelCol={{span: 5}} wrapperCol={{span: 18}}>
                        {getFieldDecorator('Reason')(<TextArea style={{minHeight: 32}} placeholder="请填写备注" rows={4}/>)}
                    </FormItem>
                </Form>
            </Modal>);
    }

}

export default Form.create()(SetInterviewModal);