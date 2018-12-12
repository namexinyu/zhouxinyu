import React from 'react';
import { Col, Row, Button, Form, Input } from 'antd';
import setParams from "ACTION/setParams";
import getBusRenterList from 'ACTION/ExpCenter/ShuttleBus/getBusRenterList';
const STATE_NAME = "reducersBusRenter";
class BusRenterForm extends React.Component {
    formItemLayout = {
        labelCol: { span: 8, offset: 0 },
        wrapperCol: { span: 16, offset: 0 }
    };
    again = () => {
        // 重置
        this.props.form.resetFields();
        this.check();
    }
    // 查询
    check = () => {
        this.props.form.validateFieldsAndScroll((errors, values) => {
            if (errors) return;
            let param = {};
            if (values.Name.trim() !== "") {
                param.RentCorpName = values.Name;
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
            getBusRenterList(param);
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
                            label="公司名称:">
                            {getFieldDecorator('Name', {
                                initialValue: ''
                            })(<Input placeholder="请输入" />)}

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
            Name
        } = props.list.queryParams;
        return {
            Name
        };
    },
    onFieldsChange(props, fields) {
        setParams(STATE_NAME, {
            queryParams: Object.assign({}, props.list.queryParams, fields)
        });
    }
})(BusRenterForm);