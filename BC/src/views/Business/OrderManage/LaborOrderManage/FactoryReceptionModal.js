import React from 'react';
import {
    Row,
    Col,
    Card,
    Form,
    Input,
    Table,
    DatePicker,
    Button,
    message,
    Select,
    Modal
} from 'antd';
import ImageShow from 'COMPONENT/ImageShow';
import moment from 'moment';
import copy from 'copy-to-clipboard';

import AutoCompleteInput from 'COMPONENT/AutoCompleteInput';
const FormItem = Form.Item;

class FactoryReceptionModal extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {};
    }

    copyRecord(e) {
        let record = this.props.ModalItem.record;
        copy(record.LaborName 
            + '\n' + record.CheckInDate 
            + '\n' + record.EnterpriseName 
            + '\n' + record.UserName 
            + '\n' + record.MobileNumber 
            + '\n' + record.IDCardNum
            + '\n会员已到接站地点，请及时联系安排接站。谢谢！');
 
        // e.originalEvent.clipboardData.setData("Text", 'record.LaborName');
        /*
        
        */
    }

    render() {
        // const {onCancel, afterClose, handleHireSetModalSubmit} = this.props;
        const {getFieldDecorator} = this.props.form;
        const {ModalItem, LaborSimpleList, RecruitSimpleList, handleModalCancel, handleFactoryModalSubmit} = this.props; 
        return (
            <Modal
                title="厂门口接站信息"
                visible={ModalItem.Visible}
                
                footer={<div>
                            <Button type="primary" onClick={(e) => {
                                e.preventDefault();
                                this.props.form.validateFields((err, fieldsValue) => {
                                    if (err) return;
                                    if (!fieldsValue['Enterprise'].value) {
                                        message.destroy();
                                        message.error("请选择正确的企业");
                                        return;
                                    }
                                    handleFactoryModalSubmit && handleFactoryModalSubmit(fieldsValue);
                                    // handleModalCancel();
                                });
                            }}>保存</Button>
                            <Button onClick={handleModalCancel}>关闭</Button>
                            <Button type="primary" onClick={this.copyRecord.bind(this)}>一键复制</Button>
                        </div>}
                 
                onCancel={handleModalCancel}
                /*
                afterClose={() => {
                    this.props.form.resetFields();
                    afterClose();
                }}
                */
               >
                <Form>
                    <Row type="flex" justify="start">
                        <Col span={12}>
                        <FormItem label="面试日期" labelCol={{span: 8}} wrapperCol={{span: 15}}>
                            {getFieldDecorator('CheckInDate', {rules: [{required: true, message: '请选择面试日期'}]})(
                                <DatePicker style={{width: '100%'}} />
                            )}
                        </FormItem>
                        </Col>
                        <Col span={12}>
                        
                        <FormItem label="会员姓名" labelCol={{span: 8}} wrapperCol={{span: 15}}>
                            {getFieldDecorator('UserName')(<Input disabled={true}/>)}
                        </FormItem>
                        </Col>
                    </Row>

                    <Row>
                    <Col span={12}>
                        <FormItem label="会员手机号" labelCol={{span: 8}} wrapperCol={{span: 15}}>
                                {getFieldDecorator('MobileNumber')(
                                    <Input placeholder="请输入手机号码" disabled={true}/>
                                )}
                        </FormItem>
                        </Col>
                        <Col span={12}>
                        
                        <FormItem label="会员身份证号" labelCol={{span: 8}} wrapperCol={{span: 15}}>
                            {getFieldDecorator('IDCardNum', {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '请输入18位身份证号'
                                                    },
                                                    {
                                                        pattern: /(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
                                                        message: '请输入正确的18位身份证号'
                                                    }
                                                ]
                                            })(<Input placeholder="请输入18位身份证号" type="text" maxLength="32"/>)}
                        </FormItem>
                    </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                        <FormItem label="劳务名称" labelCol={{span: 8}} wrapperCol={{span: 15}}>
                                {getFieldDecorator('Labor')(
                                    <AutoCompleteInput
                                        textKey="ShortName" valueKey="LaborID" maxLength="50"
                                        dataSource={LaborSimpleList}/>
                                )}
                        </FormItem>
                        </Col>
                        <Col span={12}>

                        <FormItem label="企业简称" labelCol={{span: 8}} wrapperCol={{span: 15}}>
                                {getFieldDecorator('Enterprise', {rules: [{required: true, message: '请输入企业'}]})(
                                    <AutoCompleteInput
                                        textKey="RecruitName" valueKey="RecruitTmpID" maxLength="50"
                                        dataSource={RecruitSimpleList}/>
                                )}
                        </FormItem>
                        </Col>
                    </Row>
                    <Row>
                    <Col span={12}>
                    <FormItem label="面试状态" labelCol={{span: 8}} wrapperCol={{span: 15}}>
                            {getFieldDecorator('InterviewStatus')(
                                <Select>
                                    <Select.Option value="0">未处理</Select.Option>
                                    <Select.Option value="1">未面试</Select.Option>
                                    <Select.Option value="2">通过</Select.Option>
                                    <Select.Option value="3">未通过</Select.Option>
                                    <Select.Option value="4">放弃</Select.Option>
                                </Select>
                            )}
                    </FormItem>
                    </Col>
                        <Col span={12}>
                    <FormItem label="处理状态" labelCol={{span: 8}} wrapperCol={{span: 15}}>
                            {getFieldDecorator('ProcessStatus', {rules: [{required: true, message: '请选择处理状态'}]})(
                                <Select disabled={this.props.ModalItem.record.ProcessStatus === 3}>

                                    <Select.Option value="1">未处理</Select.Option>
                                    <Select.Option value="2">处理中</Select.Option>
                                    <Select.Option value="3">已处理</Select.Option>
                                    <Select.Option value="4">已废弃</Select.Option>
                                </Select>
                            )}
                    </FormItem>
                    </Col>
                    </Row>
                    <Row>
                    <Col span={12}>
                    <FormItem label="处理说明" labelCol={{span: 8}} wrapperCol={{span: 15}}>
                            {getFieldDecorator('ProcessRemark')(<Input maxLength="64"/>)}
                    </FormItem>
                    </Col>
                    </Row>
                    <Row type="flex" justify="space-around" align="middle" className="mt-8" gutter={40} style={{display: this.props.ModalItem.record.idCard1 && this.props.ModalItem.record.idCard2 ? '' : 'none'}}>
                        <Col span={12} className="text-center" style={{height: '200px'}}>
                            <ImageShow
                                url={this.props.ModalItem.record.idCard1}/>
                        </Col>
                        <Col span={12} className="text-center" style={{height: '200px'}}>
                            <ImageShow
                                url={this.props.ModalItem.record.idCard2}/>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        );
    }

}

export default Form.create({
    mapPropsToFields(props) {
        let record = props.ModalItem.record;
        return {
            CheckInDate: {value: moment(record.CheckInDate)},
            UserName: {value: record.UserName},
            MobileNumber: {value: record.MobileNumber},
            IDCardNum: {value: record.IDCardNum},
            Labor: {value: {text: record.LaborName, value: record.LaborID}},
            Enterprise: {value: {text: record.EnterpriseName, value: record.RecruitTmpID}},
            InterviewStatus: {value: record.InterviewStatus + ''},
            ProcessStatus: {value: record.ProcessStatus + ''},
            ProcessRemark: {value: record.ProcessRemark}
        };
    }
})(FactoryReceptionModal);