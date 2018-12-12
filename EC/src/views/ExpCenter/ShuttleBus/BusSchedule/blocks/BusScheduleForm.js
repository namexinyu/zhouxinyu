import React from 'react';
import { Col, Row, Button, Form, Select } from 'antd';
import getBusScheduleList from 'ACTION/ExpCenter/ShuttleBus/getBusScheduleList';
import setParams from "ACTION/setParams";
const STATE_NAME = "reducersBusSchedule";
const Option = Select.Option;
class BusScheduleForm extends React.Component {
    formItemLayout = {
        labelCol: { span: 8, offset: 0 },
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
            let param = {};
            if (fieldsValue.OriginID) {
                param.OriginID = fieldsValue.OriginID * 1;
            }
            if (fieldsValue.DestID) {
                param.DestID = fieldsValue.DestID * 1;
            }
            param.RecordIndex = 0;
            param.RecordSize = 10;
            setParams(STATE_NAME, {
                pageParam: {
                    ...this.props.list.pageParam,
                    RecordIndex: 1,
                    RecordSize: 10
                }
            });
            getBusScheduleList(param); 
        });
    }
    render() {
        const FormItem = Form.Item;
        const { form } = this.props;
        const { getFieldDecorator } = form;
        return (
            <Form>
                <Row gutter={32} type="flex" justify="start">
                    <Col span={5}>
                        <FormItem {...this.formItemLayout}
                            label="始发地:">
                            {getFieldDecorator('OriginID', {
                                    initialValue: ''
                                })(<Select>
                                        <Option key="-9999">全部</Option>
                                        {this.props.HubSimpleList.map((key, index) => {
                                            return (<Option key={index} value={key.HubID + ''}>{key.HubName}</Option>);
                                        })}
                                    </Select>)}

                        </FormItem>
                    </Col>
                    <Col span={5}>
                        <FormItem {...this.formItemLayout}
                            label="目的地:">
                            {getFieldDecorator('DestID', {
                                    initialValue: ''
                                })(<Select>
                                        <Option key="-9999">全部</Option>
                                        {this.props.HubSimpleList.map((key, index) => {
                                            return (<Option key={index} value={key.HubID + ''}>{key.HubName}</Option>);
                                        })}
                                    </Select>)}
                        </FormItem>
                    </Col>
                    <Col span={14} className="mb-16 text-right">
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
            OriginID,
            DestID
        } = props.list.queryParams;
        return {
            OriginID,
            DestID
        };
    },
    onFieldsChange(props, fields) {
        setParams(STATE_NAME, {
            queryParams: Object.assign({}, props.list.queryParams, fields)
        });
    }
})(BusScheduleForm);