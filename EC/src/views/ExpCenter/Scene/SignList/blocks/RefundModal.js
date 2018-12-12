import React from 'react';
import {Form, Row, Col, Button, Input, Select, Table, Modal, Upload, Icon, message, Radio} from 'antd';
import setParams from "ACTION/setParams";
import AliyunOssUploader from "UTIL/aliyun/AliyunOssUploader";
import AppSessionStorage from "CONFIG/SessionStorage/AppSessionStorage";
import "LESS/components/picture-upload.less";
// 业务相关
import addRefundData from 'ACTION/ExpCenter/InterviewRefund/addRefundData';
import resetState from 'ACTION/resetState';
import Mapping_Scene from "CONFIG/EnumerateLib/Mapping_Scene";
import ossConfig from 'CONFIG/ossConfig';

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const IMG_PATH = ossConfig.getImgPath();

class RefundModal extends React.PureComponent {
    constructor(props) {
        super(props);
        this.uploader = null;
        this.eRefundPayType = Mapping_Scene.eRefundPayType;
        this.eRefundPayTypeList = Object.keys(this.eRefundPayType).reverse();
        this.eRefundReason = Mapping_Scene.eRefundReason;
        this.eRefundReasonList = Object.keys(this.eRefundReason);
    }

    componentWillMount() {

    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {

    }

    componentWillUpdate(nextProps, nextState) {

    }

    componentDidUpdate() {

    }

    componentWillUnmount() {

    }

    handleSetParam(key, value, paramName = 'RefundData') {
        let data = this.props.refund;
        setParams(data.state_name, {[paramName]: Object.assign({}, data[paramName], {[key]: value})});
    }

    handleDoRefund() {
        let data = this.props.refund;
        // if (!data.RefundData.IDCardPicPath) {
        //     message.info('报销必须上传凭证');
        //     return;
        // }
        let param = {
            UserID: data.InterviewData.UserID,
            HubID: data.InterviewData.HubID,
            InterviewID: data.InterviewData.InterviewID,
            EmployeeID: AppSessionStorage.getEmployeeID(),
            RefundAmount: data.InterviewData.ChargeAmount,
            RefundPayType: data.RefundData.RefundPayType,
            // RefundReason: data.RefundData.RefundReason,
            IDCardPicPath: data.RefundData.IDCardPicPath
        };
        addRefundData(param);
    }

    hideModal() {
        console.log('hideModal');
        let data = this.props.refund;
        resetState(data.state_name);
        // setParams(data.state_name, {
        //     InterviewID: undefined,
        //     DispatchData: undefined,
        //     RefundData: {Money: undefined, URL: undefined}
        // });
    }

    handlePictureUpload(file) {
        if (!ossConfig.checkImage(file)) return;
        if (!this.uploader) this.uploader = new AliyunOssUploader();
        this.uploader.uploadFile(file, (res, message) => {
            if (res) {
                let data = this.props.refund;
                let RefundData = Object.assign({}, data.RefundData, {IDCardPicPath: res.name});
                setParams(data.state_name, {RefundData: RefundData});
            } else {
                console.log('fail', message);
            }
        });
        return false;
    }

    render() {
        let data = this.props.refund;
        const fLayout = {
            labelCol: {span: 7},
            wrapperCol: {span: 17}
        };
        const {getFieldDecorator} = this.props.form;
        if (data.InterviewID == undefined || data.InterviewID == null) return (<div className="style-none"></div>);
        return (
            <Modal
                width={600}
                title="退费"
                visible={true}
                // visible={data.InterviewID != undefined && data.InterviewID != null && data.InterviewID != ''}
                onOk={() => this.handleDoRefund()}
                onCancel={() => this.hideModal()}
                okText="确认"
                cancelText="取消"
            >
                <Row>
                    <Col span={20} offset={2}>
                        <Form onSubmit={(e) => e.preventDefault()}>
                            <FormItem {...fLayout} label="会员名称">
                                <Input disabled value={data.InterviewData ? data.InterviewData.UserName : ''}/>
                            </FormItem>
                            <FormItem {...fLayout} label="会员手持身份证照片">
                                <Upload className="avatar-uploader" accept="image/jpeg,image/png"
                                        beforeUpload={(file) => this.handlePictureUpload(file)}
                                        name="avatar">
                                    {data.RefundData.IDCardPicPath ? (
                                            <img src={IMG_PATH + data.RefundData.IDCardPicPath}/>) :
                                        (<Icon type="plus" className="avatar-uploader-trigger"/>)}
                                </Upload>
                            </FormItem>
                            {/* 暂时隐藏 */}
                            <FormItem {...fLayout} label="退费类型" className="display-none">
                                <RadioGroup value={data.RefundData.RefundPayType + ''}
                                            onChange={(e) => this.handleSetParam('RefundPayType', e.target.value - 0)}>
                                    {this.eRefundPayTypeList.map((key, index) => {
                                        return <RadioButton key={index}
                                                            value={key + ''}>{this.eRefundPayType[key]}</RadioButton>;
                                    })}
                                </RadioGroup>
                            </FormItem>
                            {/* <FormItem {...fLayout} label="面试状态选择">*/}
                            {/* <RadioGroup value={data.RefundData.RefundReason + ''}*/}
                            {/* onChange={(e) => this.handleSetParam('RefundReason', e.target.value - 0)}>*/}
                            {/* {this.eRefundReasonList.map((key, index) => {*/}
                            {/* return <RadioButton key={index}*/}
                            {/* value={key + ''}>{this.eRefundReason[key]}</RadioButton>;*/}
                            {/* })}*/}
                            {/* </RadioGroup>*/}
                            {/* </FormItem>*/}
                        </Form>
                    </Col>
                </Row>
            </Modal>
        );
    }
}


export default Form.create()(RefundModal);