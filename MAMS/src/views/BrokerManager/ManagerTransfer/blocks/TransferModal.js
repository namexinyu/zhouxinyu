import React from 'react';
import {Form, Input, Button, Row, Col, Modal, message} from 'antd';
import setParams from "ACTION/setParams";
import resetState from 'ACTION/resetState';
// 业务相关
import ManagerTransferAction from 'ACTION/BrokerManager/ManagerTransferAction';

const FormItem = Form.Item;

class TransferModal extends React.PureComponent {
    constructor(props) {
        super(props);
        this.handleModalOk = this.handleModalOk.bind(this);
        this.handleModalCancel = this.handleModalCancel.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        let nextData = nextProps.list;
        let curData = this.props.list;
        if (nextData.mtChangeBrokerFetch.status == 'success' && curData.mtChangeBrokerFetch.status != 'success') {
            message.info('划转经纪人成功');
            resetState(nextData.state_name);
        } else if (nextData.mtChangeBrokerFetch.status == 'error' && curData.mtChangeBrokerFetch.status != 'error') {
            let res = nextData.mtChangeBrokerFetch.response;
            message.info('划转经纪人失败' + (res && res.Desc ? ': ' + res.Desc : ''));
            setParams(nextData.state_name, {mtChangeBrokerFetch: {status: 'close'}});
        }
    }

    handleModalOk() {
        let data = this.props.list;
        let info = data.Result;
        let ChangeData = data.ChangeData;
        if (!info) return;
        // 初次点击确认划转
        if (!info.Confirm) {
            setParams(data.state_name, {Result: Object.assign({}, info, {Confirm: true})});
        } else { // 再次确认时转人
            // if (!ChangeData.BrokerNum.value) {
            //     message.info('请填写划转经纪人工号');
            //     return;
            // }
            // if ((ChangeData.Reason.value || '').length < 5) {
            //     message.info('备注不得少于五个字');
            //     return;
            // }
            this.props.form.validateFieldsAndScroll((errors, values) => {
                if (!errors) {
                    let param = {
                        IDCardNum: '',
                        Mobile: info.Mobile,
                        Name: info.Name,
                        Reason: ChangeData.Reason.value,
                        BrokerNum: ChangeData.BrokerNum.value,
                        PicUrl: ''
                    };
                    ManagerTransferAction.mtChangeBroker(param);
                }
            });
        }
    }

    handleModalCancel() {
        let data = this.props.list;
        setParams(data.state_name, {
            Result: undefined,
            ChangeData: {
                Reason: {value: ''},
                BrokerNum: {value: ''}
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
        let info = data.Result;
        if (!info) return (<div></div>);
        return (
            <Modal
                title="查询结果"
                visible={true}
                onOk={this.handleModalOk}
                footer={null}
                onCancel={this.handleModalCancel}>
                <Form onSubmit={(e) => this.handleSearch(e)}>
                    <Row className={info.Confirm ? 'display-none' : ''}>
                        <Col className="gutter-box" span={24}>
                            <FormItem {...fLayout} label="会员名称">
                                <Input value={info.Name} readOnly/>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row className={info.Confirm ? 'display-none' : ''}>
                        <Col className="gutter-box" span={24}>
                            <FormItem {...fLayout} label="会员手机号">
                                <Input value={info.Mobile} readOnly/>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row className="display-none">
                        <Col className="gutter-box" span={24}>
                            <FormItem {...fLayout} label="会员身份证号">
                                <Input value={info.IDCardNum} readOnly/>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row className={info.Confirm ? 'display-none' : ''}>
                        <Col className="gutter-box" span={24}>
                            <FormItem {...fLayout} label="当前经纪人">
                                <Input value={info.BrokerNum} readOnly/>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row className={!info.Confirm ? 'display-none' : ''}>
                        <Col className="gutter-box" span={24}>
                            <FormItem {...fLayout} label="划转经纪人工号">
                                {getFieldDecorator('BrokerNum', {
                                    rules: [{required: true, message: '请填写划转经纪人工号'}]
                                })(
                                    <Input placeholder="输入划转经纪人工号"/>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row className={!info.Confirm ? 'display-none' : ''}>
                        <Col className="gutter-box" span={24}>
                            <FormItem {...fLayout} label="备注">
                                {getFieldDecorator('Reason', {
                                    rules: [{required: true, pattern: /^[\s\S]{5,120}$/, message: '备注不得少于五个字'}]
                                })(
                                    <Input.TextArea autosize={{minRows: 2, maxRows: 6}} maxLength="120"
                                                    placeholder="填写备注"/>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="gutter-box" span={24}>
                            <FormItem className="text-center">
                                <Button className="ant-btn ml-8" htmlType="button" onClick={this.handleModalOk}
                                        type="primary">确认划转</Button>
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
    return Object.assign({}, props.list.ChangeData);
};

let onFieldsChange = (props, fields) => {
    setParams(props.list.state_name, {ChangeData: Object.assign({}, props.list.ChangeData, fields)});
};

export default Form.create({mapPropsToFields, onFieldsChange})(TransferModal);