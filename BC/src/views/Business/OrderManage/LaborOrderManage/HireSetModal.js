import React from 'react';
import {
    Form,
    Input,
    Modal,
    Radio,
    Select,
    Spin,
    InputNumber,
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

class HireSetModal extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const {onCancel, afterClose, handleHireSetModalSubmit} = this.props;
        const {getFieldDecorator} = this.props.form;
        return (
            <Modal
                title="手工结算"
                visible={this.props.hireSetModalVisible}
                onOk={(e) => {
                    e.preventDefault();
                    this.props.form.validateFields((err, fieldsValue) => {
                        if (err) return;
                        handleHireSetModalSubmit && handleHireSetModalSubmit(fieldsValue);
                    });
                }} onCancel={onCancel}
                afterClose={() => {
                    this.props.form.resetFields();
                    afterClose();
                }}>
                <Form>
                    <FormItem label="会员姓名" labelCol={{span: 5}} wrapperCol={{span: 18}}>
                        {getFieldDecorator('RealName')(<Input disabled={true}/>)}
                    </FormItem>
                    <FormItem label="身份证" labelCol={{span: 5}} wrapperCol={{span: 18}}>
                        {getFieldDecorator('IDCardNum')(<Input disabled={true}/>)}
                    </FormItem>
                    <FormItem label="性别" labelCol={{span: 5}} wrapperCol={{span: 18}}>
                        {getFieldDecorator('Gender')(<Input disabled={true}/>)}
                    </FormItem>
                    <FormItem label="签到时间" labelCol={{span: 5}} wrapperCol={{span: 18}}>
                        {getFieldDecorator('CheckInTime')(<Input disabled={true}/>)}
                    </FormItem>
                    <FormItem label="会员状态" labelCol={{span: 5}} wrapperCol={{span: 18}}>
                        {getFieldDecorator('OrderStep', {
                            rules: [{required: true}, {
                                validator: (rule, value, cb) => (value == -9999 ? cb(true) : cb()),
                                message: '请选择会员状态'
                            }],
                            initialValue: '-9999'
                        })(<Select>
                                <Option value="-9999">请选择</Option>
                                {Object.entries(OrderStep).filter(item => [23, 24, 25].includes(Number(item[0]))).map((i) => {
                                    return <Option value={i[0].toString()} key={i[0]}>{i[1]}</Option>;
                                })}
                            </Select>
                        )}
                    </FormItem>
                    <FormItem label="劳务参考" labelCol={{span: 5}} wrapperCol={{span: 18}}>
                        {getFieldDecorator('LaborSubsidyAmountReal', {
                            rules: [{required: true}], initialValue: '0'
                        })(<InputNumber min={0}/>)}元
                    </FormItem>
                    <FormItem label="入职时间" labelCol={{span: 5}} wrapperCol={{span: 18}}>
                        {getFieldDecorator('HireDate', {
                            rules: [{required: true, message: '请选择入职时间'}]
                        })(
                            <DatePicker
                                onChange={(value) => {
                                    this.setState({
                                        HireDate: value
                                    });
                                }}
                                disabledDate={(value) => {
                                    const LeaveDate = this.state.LeaveDate;
                                    if (!value || !LeaveDate) {
                                        return false;
                                    }
                                    return value.valueOf() > LeaveDate.valueOf();
                                }}
                            />)}
                    </FormItem>
                    <FormItem label="离职时间" labelCol={{span: 5}} wrapperCol={{span: 18}}>
                        {getFieldDecorator('LeaveDate')(
                            <DatePicker
                                onChange={(value) => {
                                    this.setState({
                                        LeaveDate: value
                                    });
                                }}
                                disabledDate={(value) => {
                                    const HireDate = this.state.HireDate;
                                    if (!value || !HireDate) {
                                        return false;
                                    }
                                    return value.valueOf() <= HireDate.valueOf();
                                }}
                            />)}
                    </FormItem>
                </Form>
            </Modal>
        );
    }

}

export default Form.create({
    mapPropsToFields(props) {
        return {
            RealName: {value: props.RealName},
            IDCardNum: {value: props.IDCardNum},
            CheckInTime: {value: props.CheckInTime},
            Gender: {value: props.Gender && props.Gender === 1 ? '男' : props.Gender && props.Gender === 2 ? '女' : '未设置'}
        };
    }
})(HireSetModal);