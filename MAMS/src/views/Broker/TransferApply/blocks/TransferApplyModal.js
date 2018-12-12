import React from 'react';
import {Form, Input, Button, Row, Col, Modal, message} from 'antd';
import setParams from "ACTION/setParams";
import resetState from 'ACTION/resetState';
import regexRule from 'UTIL/constant/regexRule';
// 业务相关
import TransferApplyAction from 'ACTION/Broker/TransferApply/TransferApplyAction';

const FormItem = Form.Item;

class TransferApplyModal extends React.PureComponent {
    constructor(props) {
        super(props);
        this.handleModalOk = this.handleModalOk.bind(this);
        this.handleModalCancel = this.handleModalCancel.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        let nextData = nextProps.list;
        let curData = this.props.list;
        if (nextData.CallTransferApplyFetch.status == 'success' && curData.CallTransferApplyFetch.status != 'success') {
            message.info('申请成功');
            this.handleModalCancel();
        } else if (nextData.CallTransferApplyFetch.status == 'error' && curData.CallTransferApplyFetch.status != 'error') {
            let res = nextData.CallTransferApplyFetch.response;
            message.info('申请失败' + (res && res.Desc ? ': ' + res.Desc : ''));
            setParams(nextData.state_name, {CallTransferApplyFetch: {status: 'close'}});
        }
    }

    handleModalOk() {
        let data = this.props.list;
        let info = data.ApplyData;
        if (!info) return;
        // 初次点击确认划转 123
        this.props.form.validateFieldsAndScroll((errors, values) => {
            if (!errors) {
                let param = {
                    Mobile: info.Mobile.value,
                    ApplyReason: info.Reason.value
                };
                TransferApplyAction.CallTransferApply(param);
            }
        });
    }

    handleModalCancel() {
        let data = this.props.list;
        setParams(data.state_name, {
            showModal: false,
            ApplyData: {
                Mobile: {value: ''},
                Reason: {value: ''}
            }
        });
    }

    render() {
        const fLayout = {
            labelCol: {span: 8},
            wrapperCol: {span: 16}
        };
        const {getFieldDecorator} = this.props.form;
        let data = this.props.list;
        let info = data.ApplyData;
        if (!info) return (<div></div>);
        return (
            <Modal
                title="申请转人"
                visible={true}
                onOk={this.handleModalOk}
                footer={null}
                onCancel={this.handleModalCancel}>
                <Form onSubmit={(e) => this.handleSearch(e)}>
                    <Row>
                        <Col className="gutter-box" span={24}>
                            <FormItem {...fLayout} label="手机号码">
                                {getFieldDecorator('Mobile', {
                                    rules: [{required: true, pattern: regexRule.mobile, message: '请填写正确的手机号'}]
                                })(
                                    <Input placeholder="填写手机号"/>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="gutter-box" span={24}>
                            <FormItem {...fLayout} label="申请理由">
                                {getFieldDecorator('Reason', {
                                    rules: [{required: true, pattern: /^[\s\S]{5,120}$/, message: '申请理由不能少于五个字'}]
                                })(
                                    <Input.TextArea autosize={{minRows: 5, maxRows: 8}} maxLength="120"
                                                    placeholder="填写理由"/>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="gutter-box" span={24}>
                            <FormItem className="text-center">
                                <Button className="ant-btn ml-8" htmlType="button" onClick={this.handleModalOk}
                                        type="primary">确认</Button>
                                <Button className="ant-btn ml-8" onClick={this.handleModalCancel}>取消</Button>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        );
    }
}

let mapPropsToFields = (props) => {
    return Object.assign({}, props.list.ApplyData);
};

let onFieldsChange = (props, fields) => {
    setParams(props.list.state_name, {ApplyData: Object.assign({}, props.list.ApplyData, fields)});
};

export default Form.create({mapPropsToFields, onFieldsChange})(TransferApplyModal);