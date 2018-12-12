import React from 'react';
import {Form, Input, Button, Row, Col} from 'antd';
import setParams from "ACTION/setParams";
import resetQueryParams from "ACTION/resetQueryParams";
import {browserHistory} from 'react-router';
// 业务相关
import ManagerTransferAction from 'ACTION/Assistant/ManagerTransferAction';
import TransferModal from './TransferModal';

const FormItem = Form.Item;

class ManagerTransfer extends React.PureComponent {
    constructor(props) {
        super(props);
        this.handleReset = this.handleReset.bind(this);
    }

    handleReset() {
        let data = this.props.list;
        resetQueryParams(data.state_name);
    }

    handleSearch(e) {
        if (e) e.preventDefault();
        this.props.form.validateFieldsAndScroll((errors, values) => {
            if (!errors) {
                let data = this.props.list;
                let queryParams = data.queryParams;
                console.log('param', param);
                let param = {
                    Name: queryParams.Name.value,
                    Mobile: queryParams.Mobile.value,
                    IDCardNum: queryParams.IDCardNum.value || ''
                };
                console.log('param', param);
                ManagerTransferAction.mtGetCurrentBroker(param);
            }
        });

    }

    handleGoPage(path) {
        browserHistory.push({
            pathname: path
        });
    }

    render() {
        const fLayout = {
            labelCol: {span: 8},
            wrapperCol: {span: 16}
        };
        const {getFieldDecorator} = this.props.form;
        const data = this.props.list;
        return (
            <div>
                <Row className="mb-24 mt-24">
                    <Col span={12} offset={6}><h1 className="text-center">划转会员信息查询</h1></Col>
                    <Col span={6} className="text-right">
                        <Button className="ant-btn ml-8 mr-16" htmlType="button"
                                onClick={() => this.handleGoPage('/broker/manager/transfer-log')}
                                type="primary">划转日志</Button>
                    </Col>
                </Row>
                <Form onSubmit={(e) => this.handleSearch(e)}>
                    <Row>
                        <Col className="gutter-box" span={16} offset={4}>
                            <FormItem {...fLayout} label="会员名称">
                                {getFieldDecorator('Name', {
                                    rules: [{required: true, message: '会员名称必填'}]
                                })(
                                    <Input placeholder="输入会员名称"/>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="gutter-box" span={16} offset={4}>
                            <FormItem {...fLayout} label="会员手机号">
                                {getFieldDecorator('Mobile', {
                                    rules: [{required: true, message: '手机号必填'}]
                                })(
                                    <Input placeholder="输入会员手机号"/>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row className="display-none">
                        <Col className="gutter-box" span={16} offset={4}>
                            <FormItem {...fLayout} label="会员身份证号">
                                {getFieldDecorator('IDCardNum', {
                                    rules: []
                                })(
                                    <Input placeholder="输入会员身份证"/>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="gutter-box" span={16} offset={4}>
                            <FormItem className="text-center">
                                <Button className="ant-btn ml-8" onClick={this.handleReset.bind(this)}>重置</Button>
                                <Button className="ant-btn ml-8" htmlType="submit" type="primary">查询</Button>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
                {data.Result ? <TransferModal list={this.props.list}/> : ''}
            </div>);
    }
}

let mapPropsToFields = (props) => {
    return Object.assign({}, props.list.queryParams);
};

let onFieldsChange = (props, fields) => {
    setParams(props.list.state_name, {queryParams: Object.assign({}, props.list.queryParams, fields)});
};

export default Form.create({mapPropsToFields, onFieldsChange})(ManagerTransfer);

