import React from 'react';
import {Modal, Form, message, Row, Col, Input, Button, Popconfirm, Radio, DatePicker, Cascader, Select} from 'antd';
import resetState from "ACTION/resetState";
import ImageShow from 'COMPONENT/ImageShow';
import setParams from "ACTION/setParams";
import moment from 'moment';
import getClient from 'COMPONENT/AliyunUpload/getClient';
import uploadRule from 'CONFIG/uploadRule';
// 业务相关
import IDCardAction from 'ACTION/Audit/Modal/IDCardAction';
import getAntAreaOptions from 'CONFIG/antAreaOptions';
import NationList from 'CONFIG/NationList';
import Mapping_Audit from 'CONFIG/EnumerateLib/Mapping_Audit';
import VerifyIdentity from 'UTIL/base/VerifyIdentity';


const Option = Select.Option;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const {RangePicker} = DatePicker;

class IDCardModal extends React.PureComponent {
    constructor(props) {
        super(props);
        this.antOptions = getAntAreaOptions;
        this.eReason = Mapping_Audit.eIDCardReason;
    }

    componentWillMount() {
        console.log('IDCardModal Mount', this.props);
        let data = this.props.detail;
        let info = data.Data || {};
        if (data.ID != undefined && data.ID != null && data.ID != (info.CertFlowID || {}).value) {
            IDCardAction.modalGetIDCardData({CertFlowID: this.props.detail.ID});
        }
    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {
        let nData = nextProps.detail;
        let data = this.props.detail;
        if (nData.Data != data.Data && nData.Data && !data.Data) {
            getClient(uploadRule.idCardPic).then((client) => {
                let IMAGE_IDCardFront, IMAGE_IDCardBack;
                let info = nData.Data;
                if (info.IDCardPicPathFront && info.IDCardPicPathFront.value) {
                    IMAGE_IDCardFront = client.signatureUrl(info.IDCardPicPathFront.value);
                }
                if (info.IDCardPicPathBack && info.IDCardPicPathBack.value) {
                    IMAGE_IDCardBack = client.signatureUrl(info.IDCardPicPathBack.value);
                }
                setParams(nData.state_name, {
                    Data: Object.assign({}, nData.Data, {
                        IMAGE_IDCardFront,
                        IMAGE_IDCardBack
                    })
                });
            });
        }
        if (nData.AuditIDCardFetch.status == 'success' && data.AuditIDCardFetch.status != 'success') {
            message.info("操作成功");
            this.handleCloseModal();
        }
        else if (nData.AuditIDCardFetch.status == 'error' && data.AuditIDCardFetch.status != 'error') {
            message.info('操作失败');
            setParams(data.state_name, {AuditIDCardFetch: {status: 'close'}});
        }
        if (nData.ModifyIDCardFetch.status == 'success' && data.ModifyIDCardFetch.status != 'success') {
            message.info("操作成功");
            this.handleCloseModal();
        }
        else if (nData.ModifyIDCardFetch.status == 'error' && data.ModifyIDCardFetch.status != 'error') {
            message.info('操作失败');
            setParams(data.state_name, {ModifyIDCardFetch: {status: 'close'}});
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
        if (!info.CertAuditFailReason) {
            message.info('请选择不通过原因');
            return false;
        }
        let param = {
            AreaCode: '',
            CertAuditFailReason: info.CertAuditFailReason - 0,
            Address: '',
            AuditStatus: 4,
            CertFlowID: info.CertFlowID.value,
            IDCardNum: '',
            Native: -9999,
            RealName: '',
            SignDepart: '',
            ValidateDate: ''
        };
        IDCardAction.modalAuditIDCardData(param);
    }

    handleAuditAccept() { // 通过
        this.props.form.validateFieldsAndScroll((errors, values) => {
            // || Object.keys(errors).filter((key) => key != 'RealNameConfirm' && key != 'IDCardNumConfirm').length == 0
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
            // || Object.keys(errors).filter((key) => key != 'RealNameConfirm' && key != 'IDCardNumConfirm').length == 0
            if (!errors) {
                let data = this.props.detail;
                let info = data.Data;
                // 目前产品要求的交互为两次输入不一致时，重新输入。若有需要，已可修改两个confirm
                // info.RealName.value != info.RealNameConfirm.value ||
                if (info.firstConfirm && (info.IDCardNum.value != info.IDCardNumConfirm.value)) {
                    message.info('两次输入的身份证号码不一致，重新输入');
                    setParams(data.state_name, {
                        Data: Object.assign({}, data.Data, {
                            RealName: {value: ''},
                            IDCardNum: {value: ''},
                            RealNameConfirm: {value: ''},
                            IDCardNumConfirm: {value: ''},
                            firstConfirm: false
                        })
                    });
                    return;
                }
                let param = {
                    AreaCode: info.AreaCode && info.AreaCode.value ? info.AreaCode.value[2] : '',
                    Address: info.Address.value ? info.Address.value : '',
                    AuditStatus: 3,
                    CertFlowID: info.CertFlowID.value,
                    IDCardNum: info.IDCardNum.value,
                    Native: info.Native.value - 0,
                    RealName: info.RealName.value,
                    SignDepart: info.SignDepart.value ? info.SignDepart.value : '',
                    ValidateDate: info.ValidateDate.value && moment(info.ValidateDate.value).isValid() ? info.ValidateDate.value.format("YYYY-MM-DD") : ''
                };
                IDCardAction.modalAuditIDCardData(param);
            }
        });

    }

    handleModify() { // 编辑
        this.props.form.validateFieldsAndScroll((errors, values) => {
            // || Object.keys(errors).filter((key) => key != 'RealNameConfirm' && key != 'IDCardNumConfirm').length == 0
            if (!errors) {
                let data = this.props.detail;
                let info = data.Data;
                let param = {
                    AreaCode: info.AreaCode && info.AreaCode.value ? info.AreaCode.value[2] : '',
                    Address: info.Address.value ? info.Address.value : '',
                    AuditStatus: info.AuditStatus.value,
                    CertFlowID: info.CertFlowID.value,
                    IDCardNum: info.IDCardNum.value,
                    Native: info.Native.value - 0,
                    RealName: info.RealName.value,
                    SignDepart: info.SignDepart.value ? info.SignDepart.value : '',
                    ValidateDate: info.ValidateDate.value && moment(info.ValidateDate.value).isValid() ? info.ValidateDate.value.format("YYYY-MM-DD") : ''
                };
                IDCardAction.modalModifyIDCardData(param);
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
            let AuStatus = (info.AuditStatus || {}).value;
            const editAble = AuStatus == 1 || (AuStatus == 3 && (info.CertSource || {}).value != 2);
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
                                                        onChange={(value) => setParams(this.props.detail.state_name,
                                                            {Data: Object.assign({}, this.props.detail.Data, {CertAuditFailReason: value})})}
                                                        value={info.CertAuditFailReason}>
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
            } else if (info.AuditStatus && info.AuditStatus.value == 3 && (info.CertSource || {}).value != 2) { // 编辑(记返费来源不可编辑)
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
                        <Col span={12} className="text-center" style={{height: '400px'}}>
                            <ImageShow url={info.IMAGE_IDCardFront}/>
                        </Col>
                        <Col span={12} className="text-center" style={{height: '400px'}}>
                            <ImageShow url={info.IMAGE_IDCardBack}/>
                        </Col>
                    </Row>
                    <Row gutter={32} className="mt-20">
                        <Col span={24} offset={0}>
                            <Row>
                                <Col span={8}>
                                    {/* className={info.firstConfirm ? 'd-none' : ''}*/}
                                    <FormItem {...fLayout} label="姓名">
                                        {getFieldDecorator('RealName', {
                                            rules: [{required: true, pattern: /^\S{1,}$/, message: '请填写正确的名称'}]
                                        })(<Input type="text" autoComplete="off" onPaste={(e) => e.preventDefault()}
                                                  placeholder="会员姓名" disabled={!editAble}/>)}
                                    </FormItem>
                                    {/* {info.firstConfirm ? (*/}
                                    {/* <FormItem {...fLayout} label="姓名">*/}
                                    {/* {getFieldDecorator('RealNameConfirm', {*/}
                                    {/* rules: [{required: true, message: '会员姓名必填'}]*/}
                                    {/* })(<Input type="text" onPaste={(e) => e.preventDefault()} autoComplete="off"*/}
                                    {/* placeholder="再次确认会员姓名"/>)}*/}
                                    {/* </FormItem>) : ''}*/}
                                </Col>
                                <Col span={8}>
                                    <FormItem {...fLayout} label="民族">
                                        {/* {required: true, message: '民族必填'}*/}
                                        {getFieldDecorator('Native', {
                                            rules: []
                                        })(<Select disabled={!editAble}>
                                            {
                                                NationList.map((item, i) => {
                                                    return (
                                                        <Option key={(i + 1).toString()}
                                                                value={(i + 1).toString()}>{item}</Option>
                                                    );
                                                })
                                            }
                                        </Select>)}
                                    </FormItem>
                                </Col>
                                <Col span={24}>
                                    <FormItem {...fLayout2} label="省/市/区">
                                        {getFieldDecorator("AreaCode", {
                                            rules: [
                                                {type: 'array', len: 3, message: '请选择省/市/区'}
                                            ]
                                        })(
                                            <Cascader disabled={!editAble} options={this.antOptions}
                                                      placeholder="请选择省/市/区" changeOnSelect/>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={24}>
                                    <FormItem {...fLayout2} label="身份证住址">
                                        {/* {required: true, message: '身份证住址必填'}*/}
                                        {getFieldDecorator('Address', {
                                            rules: []
                                        })(<Input type="text" placeholder="身份证住址" disabled={!editAble}/>)}
                                    </FormItem>
                                </Col>
                                <Col span={24}>
                                    <FormItem {...fLayout2} label="身份证号码"
                                              className={info.firstConfirm ? 'd-none' : ''}>
                                        {getFieldDecorator('IDCardNum', {
                                            rules: [{
                                                required: true,
                                                pattern: /^\d{15}$|^\d{17}([0-9]|X)$/,
                                                message: '请填写正确的15/18位身份证号码'
                                            }, {
                                                validator: function (errors, value, cb) {
                                                    if (!VerifyIdentity(value)) {
                                                        cb('身份证号码不合法');
                                                    }
                                                    cb();
                                                }
                                            }]
                                        })(<Input type="text" placeholder="身份证号码" autoComplete="off"
                                                  onPaste={(e) => e.preventDefault()} disabled={!editAble}/>)}
                                    </FormItem>
                                    {info.firstConfirm ? (
                                        <FormItem {...fLayout2} label="身份证号码">
                                            {getFieldDecorator('IDCardNumConfirm', {
                                                rules: [{
                                                    required: true,
                                                    pattern: /^\d{15}$|^\d{17}([0-9]|X)$/,
                                                    message: '请填写正确的15/18位身份证号码'
                                                }]
                                            })(<Input type="text" onPaste={(e) => e.preventDefault()} autoComplete="off"
                                                      placeholder="再次确认身份证号码"/>)}
                                        </FormItem>) : ''}
                                    {/* onPaste={(e) => e.preventDefault()}*/}
                                </Col>
                                <Col span={8}>
                                    <FormItem {...fLayout} label="有效期限">
                                        {/* {required: true, message: '有效期限必填'}*/}
                                        {getFieldDecorator('ValidateDate', {
                                            rules: []
                                        })(<DatePicker disabled={!editAble}/>)}
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem {...fLayout} label="签发机关">
                                        {/* {required: true, message: '签发机关必填'}*/}
                                        {getFieldDecorator('SignDepart', {
                                            rules: []
                                        })(<Input type="text" placeholder="签发机关" disabled={!editAble}/>)}
                                    </FormItem>
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
                title="身份证审核"
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

export default Form.create({mapPropsToFields, onFieldsChange})(IDCardModal);