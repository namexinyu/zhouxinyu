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

class ComplainModal extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const {onCancel, afterClose, onRadioGroupChange, handleComplainModalSubmit} = this.props;
        const {getFieldDecorator} = this.props.form;
        const isButieComplain = this.props.ComplainType === 4 || this.props.ComplainType === 1;
        return (
            <Modal
                title="申诉处理" onCancel={onCancel}
                visible={this.props.complainModalVisible}
                onOk={(e) => {
                    e.preventDefault();
                    this.props.form.validateFields((err, fieldsValue) => {
                        console.log(err);
                        if (err) return;
                        handleComplainModalSubmit && handleComplainModalSubmit(fieldsValue);
                    });
                }}
                afterClose={() => {
                    this.props.form.resetFields();
                    afterClose();
                }}>
                <Form>
                    <FormItem label="申诉处理" labelCol={{span: 5}} wrapperCol={{span: 18}}>
                        <RadioGroup
                            options={[ComplainStatus.AUDIT_STATUS_PASS, ComplainStatus.AUDIT_STATUS_REFUSE]}
                            onChange={onRadioGroupChange}
                            value={this.props.complainModalComplainStatus}/>
                    </FormItem>
                    {this.props.complainModalComplainStatus === ComplainStatus.AUDIT_STATUS_PASS.value &&
                    <div>
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
                                    {Object.entries(OrderStep).filter(item => {
                                        let step = isButieComplain ? [23, 16, 24] : [8, 9, 20];
                                        return step.includes(Number(item[0]));
                                    }).map((i) => {
                                        return <Option value={i[0].toString()} key={i[0]}>{i[1]}</Option>;
                                    })}
                                </Select>
                            )}
                        </FormItem>
                        <FormItem label="入职时间" labelCol={{span: 5}} wrapperCol={{span: 18}}
                                  style={{display: isButieComplain ? 'block' : 'none'}}>
                            {getFieldDecorator('HireDate', {
                                rules: [{required: isButieComplain, message: '请选择入职时间'}]
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
                        <FormItem label="离职时间" labelCol={{span: 5}} wrapperCol={{span: 18}}
                                  style={{display: isButieComplain ? 'block' : 'none'}}>
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
                    </div>}
                    {this.props.complainModalComplainStatus === ComplainStatus.AUDIT_STATUS_REFUSE.value &&
                    <FormItem label="审核详情" labelCol={{span: 5}} wrapperCol={{span: 18}}>
                        {getFieldDecorator('RefuseReason', {
                            rules: [{required: true, message: '请填写驳回原因'}]
                        })(<TextArea style={{minHeight: 32}} placeholder="请填写驳回原因" rows={4}/>)}
                    </FormItem>}
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
})(ComplainModal);