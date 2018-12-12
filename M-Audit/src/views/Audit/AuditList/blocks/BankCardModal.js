import React from 'react';
import {Modal, Form, message, Row, Col, Input, Button, Popconfirm, Radio, DatePicker, Cascader, Select} from 'antd';
import resetState from "ACTION/resetState";
import ImageShow from 'COMPONENT/ImageShow';
import setParams from "ACTION/setParams";
import moment from 'moment';
import getClient from 'COMPONENT/AliyunUpload/getClient';
import uploadRule from 'CONFIG/uploadRule';
// 业务相关
import BankCardAction from 'ACTION/Audit/Modal/BankCardAction';
import getAntAreaOptions from 'CONFIG/antAreaOptions';
import Mapping_Audit from 'CONFIG/EnumerateLib/Mapping_Audit';
import getEnumMap from 'CONFIG/getEnumMap';


const RadioGroup = Radio.Group;
const Option = Select.Option;
const FormItem = Form.Item;
const {RangePicker} = DatePicker;
const {getEnumMapByName} = getEnumMap;

class BankCardModal extends React.PureComponent {
    constructor(props) {
        super(props);
        this.antOptions = getAntAreaOptions;
        this.eReason = Mapping_Audit.eBankCardReason;
        this.state = {bankList: []};
    }

    componentWillMount() {
        console.log('BankCardModal Mount', this.props);
        let data = this.props.detail;
        let info = data.Data || {};
        if (data.ID != undefined && data.ID != null && data.ID != (info.AuditFlowID || {}).value) {
            BankCardAction.modalGetBankCardData({AuditFlowID: this.props.detail.ID});
        }
    }

    componentDidMount() {
        getEnumMapByName('BankName').then((res) => {
            this.setState({
                bankList: res
            });
        });
    }

    componentWillReceiveProps(nextProps) {
        let nData = nextProps.detail;
        let data = this.props.detail;
        if (nData.Data != data.Data && nData.Data && !data.Data) {
            getClient(uploadRule.bankCardPic).then((client) => {
                let IMAGE_BankCard;
                let info = nData.Data;
                if (info.PicPath && info.PicPath.value) {
                    IMAGE_BankCard = client.signatureUrl(info.PicPath.value);
                    setParams(nData.state_name, {
                        Data: Object.assign({}, nData.Data, {IMAGE_BankCard})
                    });
                }
            });
        }
        if (nData.AuditBankCardFetch.status == 'success' && data.AuditBankCardFetch.status != 'success') {
            let res = nData.AuditBankCardFetch.response;
            if (res && res.Data && res.Data.IsSucceed == 0) {
                message.info("操作成功");
                this.handleCloseModal();
            } else {
                message.info("操作失败,数据异常");
                setParams(data.state_name, {AuditBankCardFetch: {status: 'close'}});
            }
        }
        else if (nData.AuditBankCardFetch.status == 'error' && data.AuditBankCardFetch.status != 'error') {
            message.info('操作失败');
            setParams(data.state_name, {AuditBankCardFetch: {status: 'close'}});
        }
        if (nData.ModifyBankCardFetch.status == 'success' && data.ModifyBankCardFetch.status != 'success') {
            let res = nData.ModifyBankCardFetch.response;
            if (res && res.Data && res.Data.IsSucceed == 0) {
                message.info("操作成功");
                this.handleCloseModal();
            } else {
                message.info("操作失败,数据异常");
                setParams(data.state_name, {ModifyBankCardFetch: {status: 'close'}});
            }
            this.handleCloseModal();
        }
        else if (nData.ModifyBankCardFetch.status == 'error' && data.ModifyBankCardFetch.status != 'error') {
            message.info('操作失败');
            setParams(data.state_name, {ModifyBankCardFetch: {status: 'close'}});
        }
    }

    componentWillUpdate(nextProps, nextState) {

    }

    componentDidUpdate() {

    }

    componentWillUnmount() {

    }

    handleConfirm() {

    }

    handleCloseModal() {
        resetState(this.props.detail.state_name);
    }


    handleAuditReject() { // 不通过
        let data = this.props.detail;
        let info = data.Data;
        if (!info.Remarks) {
            message.info('请选择不通过原因');
            return false;
        }
        let param = {
            Remarks: info.Remarks - 0,
            AuditStatus: 4,
            AuditFlowID: info.AuditFlowID.value,
            BankID: -9999,
            AccountNum: ''
        };
        BankCardAction.modalAuditBankCardData(param);
    }

    handleAuditAccept() { // 通过
        this.props.form.validateFieldsAndScroll((errors, values) => {
            // || Object.keys(errors).filter((key) => key != 'RealNameConfirm' && key != 'BankCardNumConfirm').length == 0
            if (!errors) {
                let data = this.props.detail;
                if (data.Data.IsOCR && data.Data.IsOCR.value == 1) {
                    this.handleAuditConfirm();
                } else { // 非OCR,需要再次输入确认
                    setParams(data.state_name, {Data: Object.assign({}, data.Data, {firstConfirm: true})});
                }
            }
        });
    }

    handleAuditBack() { // 返回
        let data = this.props.detail;
        setParams(data.state_name, {Data: Object.assign({}, data.Data, {firstConfirm: false})});
    }

    handleAuditConfirm() { // 确认
        this.props.form.validateFieldsAndScroll((errors, values) => {
            // || Object.keys(errors).filter((key) => key != 'RealNameConfirm' && key != 'BankCardNumConfirm').length == 0
            if (!errors) {
                let data = this.props.detail;
                let info = data.Data;
                // 目前产品要求的交互为两次输入不一致时，重新输入。若有需要，已可修改两个confirm
                if (info.firstConfirm && (info.BankID.value != info.BankIDConfirm.value || info.AccountNum.value.replace(/\s/g, '') != info.AccountNumConfirm.value.replace(/\s/g, ''))) {
                    message.info('两次输入的开户行/卡号不一致，重新输入');
                    setParams(data.state_name, {
                        Data: Object.assign({}, data.Data, {
                            BankID: {value: ''},
                            AccountNum: {value: ''},
                            BankIDConfirm: {value: ''},
                            AccountNumConfirm: {value: ''},
                            firstConfirm: false
                        })
                    });
                    return;
                }
                let param = {
                    AuditStatus: 3,
                    AuditFlowID: info.AuditFlowID.value,
                    AccountNum: info.AccountNum.value.replace(/\s/g, ''),
                    BankID: info.BankID.value - 0,
                    Remarks: -9999
                };
                BankCardAction.modalAuditBankCardData(param);
            }
        });

    }

    handleModify() { // 编辑
        this.props.form.validateFieldsAndScroll((errors, values) => {
            // || Object.keys(errors).filter((key) => key != 'RealNameConfirm' && key != 'BankCardNumConfirm').length == 0
            if (!errors) {
                let data = this.props.detail;
                let info = data.Data;
                // let Bank = this.props.bankFilterList.find((item) => item.BankID + '' == info.BankID.value);
                // if (!Bank) {
                //     console.log('银行信息异常,请重新选择后提交');
                //     return;
                // }
                let param = {
                    AuditFlowID: info.AuditFlowID.value,
                    AccountNum: info.AccountNum.value.replace(/\s/g, ''),
                    BankID: info.BankID.value - 0
                };
                BankCardAction.modalModifyBankCardData(param);
            }
        });
    }


    render() {
        let data = this.props.detail;
        let info = data.Data;
        const fLayout = {
            labelCol: {span: 9},
            wrapperCol: {span: 15}
        };
        const fLayout2 = {
            labelCol: {span: 3},
            wrapperCol: {span: 21}
        };
        const {getFieldDecorator} = this.props.form;
        let modalBody;
        if (!info) modalBody = (<div></div>);
        else {
            const editAble = info.AuditStatus && (info.AuditStatus.value == 1 || info.AuditStatus.value == 3);
            let footer;
            if (info.AuditStatus && info.AuditStatus.value == 1) { // 审核
                if (!info.firstConfirm) { // 一次确认
                    footer = (<div>
                        <Row gutter={32}>
                            <Col span={8} offset={4}>
                                <Popconfirm onConfirm={() => this.handleAuditReject()}
                                            onCancel={() => setParams(data.state_name, {Data: Object.assign({}, data.Data, {showReason: false})})}
                                            visible={info.showReason}
                                            title={(<div>
                                                <Select placeholder="请选择不通过原因" style={{width: '180px'}}
                                                        onChange={(value) => {
                                                            setParams(data.state_name, {Data: Object.assign({}, data.Data, {Remarks: value})});
                                                        }}
                                                        value={info.Remarks}>
                                                    {Object.keys(this.eReason).map((key, i) => (
                                                        <Option key={i} value={key + ''}>{this.eReason[key]}</Option>
                                                    ))}
                                                </Select>
                                            </div>)} okText="确定" cancelText="取消">
                                    <Button type="primary" className="bg-danger border-danger"
                                            onClick={() => setParams(data.state_name, {Data: Object.assign({}, data.Data, {showReason: true})})}>不通过</Button>
                                </Popconfirm>
                            </Col>
                            <Col span={8} className="text-right">
                                <Button type="primary" onClick={() => this.handleAuditAccept()}>通过</Button>
                            </Col>
                        </Row>
                    </div>);
                } else { // 二次确认
                    footer = (<div>
                        <Row gutter={32}>
                            <Col span={8} offset={4}>
                                <Button type="primary" className="bg-warning border-warning"
                                        onClick={() => this.handleAuditBack()}>返回</Button>
                            </Col>
                            <Col span={8} className="text-right">
                                <Button type="primary" onClick={() => this.handleAuditConfirm()}>确认</Button>
                            </Col>
                        </Row>
                    </div>);
                }
            } else if (info.AuditStatus && info.AuditStatus.value == 3) { // 编辑
                footer = (
                    <div>
                        <Row gutter={32}>
                            <Col span={8} offset={4}>
                                <Button type="primary" className="bg-warning border-warning"
                                        onClick={() => this.handleCloseModal()}>关闭</Button>
                            </Col>
                            <Col span={8} className="text-right">
                                <Button type="primary" onClick={() => this.handleModify()}>修改</Button>
                            </Col>
                        </Row>
                    </div>);
            } else { // 查看
                footer = (
                    <div>
                        <Row gutter={32}>
                            <Col span={8} offset={4}>
                                <Button type="primary" className="bg-warning border-warning"
                                        onClick={() => this.handleCloseModal()}>关闭</Button>
                            </Col>
                            <Col span={8} className="text-right">
                                <Button type="primary" onClick={() => this.handleCloseModal()}>确定</Button>
                            </Col>
                        </Row>
                    </div>);
            }
            modalBody = (
                <div>
                    <Row>
                        <h3 style={{fontSize: '18px'}}
                            className="text-center">{data.Data.IsOCR && data.Data.IsOCR.value == 1 ? 'OCR识别结果' : ''}</h3>
                    </Row>
                    <Row gutter={32}>
                        <Col span={24} className="text-center" style={{height: '400px'}}>
                            <ImageShow url={info.IMAGE_BankCard}/>
                        </Col>
                    </Row>
                    <Row gutter={32} className="mt-20">
                        <Col span={24} offset={0}>
                            <Row>
                                <Col span={8}>
                                    <FormItem {...fLayout} label="开户银行" className={info.firstConfirm ? 'd-none' : ''}>
                                        {getFieldDecorator('BankID', {
                                            rules: [{required: true, message: '请选择开户银行'}]
                                        })(<Select disabled={!editAble} placeholder="选择银行">
                                            {
                                                (this.state.bankList || []).map((item, i) => {
                                                    return (
                                                        <Option key={i}
                                                                value={item.EnumValue.toString()}>{item.EnumDesc}</Option>
                                                    );
                                                })
                                            }
                                        </Select>)}
                                    </FormItem>
                                    {info.firstConfirm ? (
                                        <FormItem {...fLayout} label="开户银行">
                                            {getFieldDecorator('BankIDConfirm', {
                                                rules: [{required: true, message: '请选择开户银行'}]
                                            })(<Select placeholder="选择银行">
                                                {
                                                    (this.state.bankList || []).map((item, i) => {
                                                        return (
                                                            <Option key={i}
                                                                    value={item.EnumValue.toString()}>{item.EnumDesc}</Option>
                                                        );
                                                    })
                                                }
                                            </Select>)}
                                        </FormItem>) : ''}
                                </Col>

                                <Col span={24}>
                                    {/*
                                    {
                                        required: true,
                                        pattern: /^([1-9]{1})(\d{15}|\d{17}|\d{18})$/,
                                        message: '请填写正确的16/18/19位银行卡号'
                                    }*/}

                                    <FormItem {...fLayout2} label="银行卡号"
                                              className={info.firstConfirm ? 'd-none' : ''}>
                                        {getFieldDecorator('AccountNum', {
                                            rules: [
                                                {
                                                    required: true,
                                                    validator: function (rule, value, cb) {
                                                        const _value = (value || '').replace(/\s/g, '');
                                                        if (!/^([1-9]{1})(\d{15}|\d{17}|\d{18})$/.test(_value)) {
                                                            cb('请填写正确的16/18/19位银行卡号');
                                                        }
                                                        cb();
                                                    }
                                                }]
                                        })(<Input disabled={!editAble} type="text" autoComplete="off"
                                                  onPaste={(e) => e.preventDefault()} placeholder="输入银行卡号"/>)}
                                    </FormItem>
                                    {info.firstConfirm ? (
                                        <FormItem {...fLayout2} label="银行卡号">
                                            {getFieldDecorator('AccountNumConfirm', {
                                                rules: [
                                                    {
                                                        required: true,
                                                        validator: function (rule, value, cb) {
                                                            const _value = (value || '').replace(/\s/g, '');
                                                            if (!/^([1-9]{1})(\d{15}|\d{17}|\d{18})$/.test(_value)) {
                                                                cb('请填写正确的16/18/19位银行卡号');
                                                            }
                                                            cb();
                                                        }
                                                    }]
                                            })(<Input type="text" onPaste={(e) => e.preventDefault()} autoComplete="off"
                                                      placeholder="再次确认银行卡号"/>)}
                                        </FormItem>) : ''}
                                    {/* onPaste={(e) => e.preventDefault()}*/}
                                </Col>

                            </Row>
                        </Col>
                    </Row>
                    {footer}
                </div>
            );
        }

        return (
            <Modal
                width={720}
                title="银行卡信息"
                visible={true}
                footer={false}
                onOk={() => this.handleConfirm()}
                onCancel={() => this.handleCloseModal()}
                okText="确认"
                cancelText="取消"
            >
                <Form>{modalBody}</Form>
            </Modal>
        );
    }
}


let mapPropsToFields = (props) => {
    let info = props.detail.Data || {};
    return Object.keys(info).reduce((obj, key) => Object.assign(obj, {[key]: {...info[key]}}), {});
};

let onFieldsChange = (props, fields) => {
    setParams(props.detail.state_name, {Data: Object.assign({}, props.detail.Data, fields)});
};

export default Form.create({mapPropsToFields, onFieldsChange})(BankCardModal);