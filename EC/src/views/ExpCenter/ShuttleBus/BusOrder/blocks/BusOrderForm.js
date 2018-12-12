import React from 'react';
import { DatePicker, Col, Row, Button, Form, Input, Select } from 'antd';
import setParams from "ACTION/setParams";
import GetBusOrderList from 'ACTION/ExpCenter/ShuttleBus/GetBusOrderList';
const STATE_NAME = "reducersBusOrder";
const Option = Select.Option;
class BusOrderForm extends React.Component {
    formItemLayout = {
        labelCol: { span: 7, offset: 0 },
        wrapperCol: { span: 16, offset: 0 }
    };
    again = () => {
        // 重置
        this.props.form.resetFields();
        this.check();
    }
    check = () => {
        this.props.form.validateFields((err, fieldsValue) => {
            if (err) return;
            let param = {TypeKey: "web"};
            if (fieldsValue.OrderStartDate) {
                param.OrderStartDate = fieldsValue.OrderStartDate.format('YYYY-MM-DD');
            }
            if (fieldsValue.OrderEndDate) {
                param.OrderEndDate = fieldsValue.OrderEndDate.format('YYYY-MM-DD');
            }
            if (fieldsValue.DestName) {
                param.DestID = fieldsValue.DestName * 1;
            }
            if (fieldsValue.RenterName.trim() !== "") {
                param.RentCorpName = fieldsValue.RenterName;
            }
            if (fieldsValue.OrderStatus) {
                param.BusOrderStatus = fieldsValue.OrderStatus * 1;
            }
            if (fieldsValue.SettleStatus) {
                param.SettleStatus = fieldsValue.SettleStatus * 1;
            }
            if (fieldsValue.OriginName) {
                param.OriginID = fieldsValue.OriginName * 1;
            }
            param.RecordIndex = 0;
            param.RecordSize = 10;
            setParams(STATE_NAME, {
                selectedRowKeys: [],
                pageParam: {
                    ...this.props.list.pageParam,
                    RecordIndex: 1,
                    RecordSize: 10
                }
            });
            GetBusOrderList(param);
        });
    }
    render() {
        const FormItem = Form.Item;
        const {form} = this.props;
        const { getFieldDecorator } = form;
        return (
            <Form>
                <Row gutter={32} type="flex" justify="start">
                     <Col span={5}>
                        <FormItem {...this.formItemLayout}
                            label="始发地:">
                            {getFieldDecorator('OriginName', {
                                initialValue: ''
                            })(<Select>
                                <Option key="0">全部</Option>
                                {this.props.HubSimpleList.map((key, index) => {
                                    return (
                                        <Option key={index} value={key.HubID + ''}>{key.HubName}</Option>
                                    );
                                })}
                            </Select>)}

                        </FormItem>
                    </Col>
                    <Col span={5}>
                        <FormItem {...this.formItemLayout}
                            label="目的地:">
                            {getFieldDecorator('DestName', {
                                initialValue: '' 
                            })(<Select>
                                <Option key="0">全部</Option>
                                {this.props.HubSimpleList.map((key, index) => {
                                    return (
                                        <Option key={index} value={key.HubID + ''}>{key.HubName}</Option>
                                    );
                                })}
                            </Select>)}

                        </FormItem>
                    </Col>
                    <Col span={4}>
                        <FormItem {...this.formItemLayout}
                            label="租车公司:">
                            {getFieldDecorator('RenterName', {
                                initialValue: ''
                            })(<Input placeholder="请输入" />)}

                        </FormItem>
                    </Col>
                    <Col span={5}>
                        <FormItem {...this.formItemLayout}  
                            label="订单状态:">
                            {getFieldDecorator('OrderStatus', {
                                initialValue: ''
                            })(<Select
                                placeholder="请选择"
                                size="default">
                                <Option key={0} >不限</Option>
                                <Option key={2} >已发车</Option>
                                <Option key={3} >已完成</Option>
                               
                            </Select>)}

                        </FormItem>
                    </Col>
                    <Col span={5}>
                        <FormItem {...this.formItemLayout}
                            label="结算状态:">
                            {getFieldDecorator('SettleStatus', {
                                initialValue: ''
                            })(
                            <Select
                                placeholder="请选择"
                                size="default">
                                <Option key={0}>不限</Option>
                                <Option key={2}>未结算</Option>
                                <Option key={1}>已结算</Option>
                            </Select>)}

                        </FormItem>
                    </Col>
                    <Col span={5}>
                        <FormItem {...this.formItemLayout}
                            label="订单时间：">
                            <div style={{display: "flex"}}>
                                {getFieldDecorator('OrderStartDate')(<DatePicker style={{ display: "inline"}}/>)}—
                                {getFieldDecorator('OrderEndDate')(<DatePicker style={{ display: "inline"}}/>)}
                            </div>
                        </FormItem>
                    </Col>
                    <Col span={19} className="mb-16 text-right">
                        <Button type="primary" htmlType="submit" onClick={this.check} >查询</Button>
                        <Button className="ml-8" onClick={this.again}>重置</Button>
                    </Col>
                </Row>
            </Form>
        );
    }
}
export default Form.create({
    mapPropsToFields(props) {
        const {
            OrderStartDate,
            OrderEndDate,
            DestName,
            RenterName,
            OrderStatus,
            SettleStatus,
            OriginName    
        } = props.list.queryParams;
        return {
            OrderStartDate,
            OrderEndDate,
            DestName,
            RenterName,
            OrderStatus,
            SettleStatus,
            OriginName
        };
    },
    onFieldsChange(props, fields) {
        setParams(STATE_NAME, {
            queryParams: Object.assign({}, props.list.queryParams, fields)
        });
    }
})(BusOrderForm);