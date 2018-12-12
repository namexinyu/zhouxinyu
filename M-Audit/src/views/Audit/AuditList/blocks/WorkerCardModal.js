import React from 'react';
import {Modal, Form, message, Row, Col, Input, Button, Popconfirm, Radio, DatePicker, Cascader, Select} from 'antd';
import resetState from "ACTION/resetState";
import ImageShow from 'COMPONENT/ImageShow';
import setParams from "ACTION/setParams";
import moment from 'moment';
import getClient from 'COMPONENT/AliyunUpload/getClient';
import uploadRule from 'CONFIG/uploadRule';
// 业务相关
import WorkCardAction from 'ACTION/Audit/Modal/WorkCardAction';
import getAntAreaOptions from 'CONFIG/antAreaOptions';
import AppSessionStorage from "CONFIG/SessionStorage/AppSessionStorage";
import Mapping_Audit from 'CONFIG/EnumerateLib/Mapping_Audit';


const RadioGroup = Radio.Group;
const Option = Select.Option;
const FormItem = Form.Item;
const {RangePicker} = DatePicker;

class WorkerCardModal extends React.PureComponent {
    constructor(props) {
        super(props);
        this.antOptions = getAntAreaOptions;
        this.eReason = Mapping_Audit.eWorkCardReason;
    }

    componentWillMount() {
        console.log('WorkCardModal Mount', this.props);
        let data = this.props.detail;
        let info = data.Data || {};
        if (data.ID != undefined && data.ID != null && data.ID != (info.WorkCardFlowID || {}).value) {
            WorkCardAction.modalGetWorkCardData({WorkCardFlowID: this.props.detail.ID});
        }
    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {
        let nData = nextProps.detail;
        let data = this.props.detail;
        if (nData.Data != data.Data && nData.Data && !data.Data) {
            getClient(uploadRule.workerCardPic).then((client) => {
                let IMAGE_WorkCard;
                let info = nData.Data;
                if (info.CardPicPath && info.CardPicPath.value) {
                    IMAGE_WorkCard = client.signatureUrl(info.CardPicPath.value);
                    setParams(nData.state_name, {
                        Data: Object.assign({}, nData.Data, {IMAGE_WorkCard})
                    });
                }
            });
        }
        if (nData.AuditWorkCardFetch.status == 'success' && data.AuditWorkCardFetch.status != 'success') {
            message.info("操作成功");
            this.handleCloseModal();
        }
        else if (nData.AuditWorkCardFetch.status == 'error' && data.AuditWorkCardFetch.status != 'error') {
            message.info('操作失败');
            setParams(data.state_name, {AuditWorkCardFetch: {status: 'close'}});
        }
        if (nData.ModifyWorkCardFetch.status == 'success' && data.ModifyWorkCardFetch.status != 'success') {
            message.info("操作成功");
            this.handleCloseModal();
        }
        else if (nData.ModifyWorkCardFetch.status == 'error' && data.ModifyWorkCardFetch.status != 'error') {
            message.info('操作失败');
            setParams(data.state_name, {ModifyWorkCardFetch: {status: 'close'}});
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
        if (!info.WCAuditFailReason) {
            message.info('请选择不通过原因');
            return false;
        }
        let param = {
            AuditEmployeeID: AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('employeeId'),
            AuditStatus: 4,
            WorkCardFlowID: info.WorkCardFlowID.value,
            JobNum: info.JobNum.value,
            WCAuditFailReason: info.WCAuditFailReason - 0
        };
        WorkCardAction.modalAuditWorkCardData(param);
    }

    handleAuditAccept() { // 通过
        this.props.form.validateFieldsAndScroll((errors, values) => {
            // || Object.keys(errors).filter((key) => key != 'RealNameConfirm' && key != 'WorkCardNumConfirm').length == 0
            if (!errors) {
                let data = this.props.detail;
                setParams(data.state_name, {Data: Object.assign({}, data.Data, {firstConfirm: true})});
            }
        });
    }

    handleAuditBack() { // 返回
        let data = this.props.detail;
        setParams(data.state_name, {Data: Object.assign({}, data.Data, {firstConfirm: false})});
    }

    handleAuditConfirm() { // 确认
        this.props.form.validateFieldsAndScroll((errors, values) => {
            // || Object.keys(errors).filter((key) => key != 'RealNameConfirm' && key != 'WorkCardNumConfirm').length == 0
            if (!errors) {
                let data = this.props.detail;
                let info = data.Data;
                // 目前产品要求的交互为两次输入不一致时，重新输入。若有需要，已可修改两个confirm
                if (info.JobNum.value != info.JobNumConfirm.value) {
                    message.info('两次输入的工号不一致，重新输入');
                    setParams(data.state_name, {
                        Data: Object.assign({}, data.Data, {
                            JobNum: {value: ''},
                            JobNumConfirm: {value: ''},
                            firstConfirm: false
                        })
                    });
                    return;
                }
                let param = {
                    AuditStatus: 3,
                    AuditEmployeeID: AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('employeeId'),
                    WorkCardFlowID: info.WorkCardFlowID.value,
                    // WCAuditFailReason: info.WCAuditFailReason,
                    JobNum: info.JobNum.value
                };
                WorkCardAction.modalAuditWorkCardData(param);
            }
        });

    }

    handleModify() { // 编辑
        this.props.form.validateFieldsAndScroll((errors, values) => {
            // || Object.keys(errors).filter((key) => key != 'RealNameConfirm' && key != 'WorkCardNumConfirm').length == 0
            if (!errors) {
                let data = this.props.detail;
                let info = data.Data;
                let param = {
                    WorkCardFlowID: info.WorkCardFlowID.value,
                    JobNum: info.JobNum.value
                };
                WorkCardAction.modalModifyWorkCardData(param);
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
                                                        onChange={(value) => setParams(data.state_name,
                                                            {Data: Object.assign({}, data.Data, {WCAuditFailReason: value})})}
                                                        value={info.WCAuditFailReason}>
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
                    <Row gutter={32}>
                        <Col span={24} className="text-center" style={{height: '400px'}}>
                            <ImageShow url={info.IMAGE_WorkCard}/>
                        </Col>
                    </Row>
                    <Row gutter={32} className="mt-20">
                        <Col span={24} offset={0}>
                            <Row>
                                <Col span={12} offset={6}>
                                    <FormItem {...fLayout} label="企业名称">
                                        {getFieldDecorator('EntName')(<Input disabled={true}/>)}
                                    </FormItem>
                                </Col>
                                <Col span={12} offset={6}>
                                    <FormItem {...fLayout} label="姓名">
                                        {getFieldDecorator('UserName')(<Input disabled={true}/>)}
                                    </FormItem>
                                </Col>
                                <Col span={12} offset={6}>
                                    <FormItem {...fLayout} label="面试时间">
                                        {getFieldDecorator('InterviewDate')(<DatePicker disabled={true}/>)}
                                    </FormItem>
                                </Col>
                                <Col span={12} offset={6}>
                                    <FormItem {...fLayout} label="工号"
                                              className={info.firstConfirm ? 'd-none' : ''}>
                                        {getFieldDecorator('JobNum', {
                                            rules: [{
                                                required: true,
                                                pattern: /^\S{1,}$/,
                                                message: '请填写工号'
                                            }]
                                        })(<Input disabled={!editAble} type="text" autoComplete="off" onPaste={(e) => e.preventDefault()} placeholder="输入工号"/>)}
                                    </FormItem>
                                    {info.firstConfirm ? (
                                        <FormItem {...fLayout} label="工号">
                                            {getFieldDecorator('JobNumConfirm', {
                                                rules: [{
                                                    required: true,
                                                    pattern: /^\S{1,}$/,
                                                    message: '请确认工号'
                                                }]
                                            })(<Input type="text" autoComplete="off" onPaste={(e) => e.preventDefault()} placeholder="再次确认工号"/>)}
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
                title="工牌审核"
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

export default Form.create({mapPropsToFields, onFieldsChange})(WorkerCardModal);