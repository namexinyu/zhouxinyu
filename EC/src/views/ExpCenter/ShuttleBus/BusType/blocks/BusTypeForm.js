import React from 'react';
import {Col, Row, Button, Form, Input } from 'antd';
import getBusTypeList from 'ACTION/ExpCenter/ShuttleBus/getBusTypeList';
import setParams from "ACTION/setParams";
const STATE_NAME = "reducersBusType";
class BusTypeForm extends React.Component {
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
        this.props.form.validateFieldsAndScroll((errors, values) => {
            if (errors) return;
            let param = {};
            if (values.SeatNum.trim() !== "") {
                param.SeatNum = values.SeatNum * 1;
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
            getBusTypeList(param);
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
                            label="车座数:">
                            {getFieldDecorator('SeatNum', {
                                initialValue: ''
                            })(<Input type="number" placeholder="请输入" />)}

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
            SeatNum
        } = props.list.queryParams;
        return {
            SeatNum
        };
    },
    onFieldsChange(props, fields) {
        setParams(STATE_NAME, {
            queryParams: Object.assign({}, props.list.queryParams, fields)
        });
    }
})(BusTypeForm);