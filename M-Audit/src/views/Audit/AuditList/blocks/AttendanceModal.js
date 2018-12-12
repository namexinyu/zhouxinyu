import React from 'react';
import {Modal, Form, message, Row, Col, Input, Button, Popconfirm, Radio, DatePicker, Cascader, Select} from 'antd';
import resetState from "ACTION/resetState";
import ImageShow from 'COMPONENT/ImageShow';
import setParams from "ACTION/setParams";
import moment from 'moment';
import getClient from 'COMPONENT/AliyunUpload/getClient';
import uploadRule from 'CONFIG/uploadRule';
// 业务相关
import AttendanceAction from 'ACTION/Audit/Modal/AttendanceAction';
import getAntAreaOptions from 'CONFIG/antAreaOptions';
import AppSessionStorage from "CONFIG/SessionStorage/AppSessionStorage";
import Mapping_Audit from 'CONFIG/EnumerateLib/Mapping_Audit';


const RadioGroup = Radio.Group;
const Option = Select.Option;
const FormItem = Form.Item;
const {RangePicker} = DatePicker;

class AttendanceModal extends React.PureComponent {
    constructor(props) {
        super(props);
        this.antOptions = getAntAreaOptions;
        this.eReason = Mapping_Audit.eAttendanceReason;
    }

    componentWillMount() {
        console.log('AttendanceModal Mount', this.props);
        let data = this.props.detail;
        let info = data.Data || {};
        if (data.ID != undefined && data.ID != null && data.ID != (info.CountdownCheckinID || {}).value) {
            AttendanceAction.modalGetAttendanceData({CountdownCheckinID: this.props.detail.ID});
        }
    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {
        let nData = nextProps.detail;
        let data = this.props.detail;
        if (nData.Data != data.Data && nData.Data && !data.Data) {
            getClient(uploadRule.attendancePic).then((client) => {
                let IMAGE_Attendance;
                let info = nData.Data;
                if (info.CheckinPicPath && info.CheckinPicPath.value) {
                    IMAGE_Attendance = client.signatureUrl(info.CheckinPicPath.value);
                    setParams(nData.state_name, {
                        Data: Object.assign({}, nData.Data, {IMAGE_Attendance})
                    });
                }
            });
        }
        if (nData.AuditAttendanceFetch.status == 'success' && data.AuditAttendanceFetch.status != 'success') {
            message.info("操作成功");
            this.handleCloseModal();
        }
        else if (nData.AuditAttendanceFetch.status == 'error' && data.AuditAttendanceFetch.status != 'error') {
            message.info('操作失败');
            setParams(data.state_name, {AuditAttendanceFetch: {status: 'close'}});
        }
        if (nData.ModifyAttendanceFetch.status == 'success' && data.ModifyAttendanceFetch.status != 'success') {
            message.info("操作成功");
            this.handleCloseModal();
        }
        else if (nData.ModifyAttendanceFetch.status == 'error' && data.ModifyAttendanceFetch.status != 'error') {
            message.info('操作失败');
            setParams(data.state_name, {ModifyAttendanceFetch: {status: 'close'}});
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
        if (!info.CIAuditFailReason) {
            message.info('请选择不通过原因');
            return false;
        }
        let param = {
            AuditEmployeeID: AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('employeeId'),
            AuditStatus: 4,
            CountdownCheckinID: info.CountdownCheckinID.value,
            CheckinStartDate: '',
            CheckinStopDate: '',
            CIAuditFailReason: info.CIAuditFailReason - 0
        };
        AttendanceAction.modalAuditAttendanceData(param);
    }

    handleAuditAccept() { // 通过
        this.handleAuditConfirm();
        // this.props.form.validateFieldsAndScroll((errors, values) => {
        //     // || Object.keys(errors).filter((key) => key != 'RealNameConfirm' && key != 'AttendanceNumConfirm').length == 0
        //     if (!errors) {
        //         let data = this.props.detail;
        //         setParams(data.state_name, {Data: Object.assign({}, data.Data, {firstConfirm: true})});
        //     }
        // });
    }

    handleAuditBack() { // 返回
        let data = this.props.detail;
        setParams(data.state_name, {Data: Object.assign({}, data.Data, {firstConfirm: false})});
    }

    handleAuditConfirm() { // 确认
        this.props.form.validateFieldsAndScroll((errors, values) => {
            // || Object.keys(errors).filter((key) => key != 'RealNameConfirm' && key != 'AttendanceNumConfirm').length == 0
            if (!errors) {
                let data = this.props.detail;
                let info = data.Data;
                let param = {
                    AuditStatus: 3,
                    AuditEmployeeID: AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('employeeId'),
                    CountdownCheckinID: info.CountdownCheckinID.value,
                    // CIAuditFailReason: 0,
                    CheckinStartDate: info.CheckinStartDate.value.format('YYYY-MM-DD HH:00:00'),
                    CheckinStopDate: info.CheckinStopDate.value.format('YYYY-MM-DD HH:00:00')
                };
                AttendanceAction.modalAuditAttendanceData(param);
            }
        });

    }

    handleModify() { // 编辑
        this.props.form.validateFieldsAndScroll((errors, values) => {
            // || Object.keys(errors).filter((key) => key != 'RealNameConfirm' && key != 'AttendanceNumConfirm').length == 0
            if (!errors) {
                let data = this.props.detail;
                let info = data.Data;
                let param = {
                    CountdownCheckinID: info.CountdownCheckinID.value,
                    CheckinStartDate: info.CheckinStartDate.value.format('YYYY-MM-DD HH:00:00'),
                    CheckinStopDate: info.CheckinStopDate.value.format('YYYY-MM-DD HH:00:00')
                };
                AttendanceAction.modalModifyAttendanceData(param);
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
                                                            {Data: Object.assign({}, data.Data, {CIAuditFailReason: value})})}
                                                        value={info.CIAuditFailReason}>
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
                            <ImageShow url={info.IMAGE_Attendance}/>
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
                                    <FormItem {...fLayout} label="工号">
                                        {getFieldDecorator('JobNum')(<Input disabled={true}/>)}
                                    </FormItem>
                                </Col>
                                <Col span={12} offset={6}>
                                    <FormItem {...fLayout} label="考勤日期起始">
                                        {getFieldDecorator('CheckinStartDate', {
                                            rules: [{
                                                required: true,
                                                message: '请填写起始日期'
                                            }]
                                        })(<DatePicker format="YYYY-MM-DD HH:00:00" showTime={{format: 'HH'}}
                                                       disabled={!editAble}/>)}
                                    </FormItem>
                                </Col>
                                <Col span={12} offset={6}>
                                    <FormItem {...fLayout} label="考勤日期结束">
                                        {getFieldDecorator('CheckinStopDate', {
                                            rules: [{
                                                required: true,
                                                message: '请填写结束日期'
                                            }]
                                        })(<DatePicker format="YYYY-MM-DD HH:00:00" showTime={{format: 'HH'}}
                                                       disabled={!editAble}/>)}
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
                title="考勤审核"
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

export default Form.create({mapPropsToFields, onFieldsChange})(AttendanceModal);