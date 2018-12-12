import React from 'react';
import {Form, Row, Col, Button, Input, Select, Table, Modal, Upload, Icon, Radio, message} from 'antd';
import setParams from "ACTION/setParams";
import AliyunOssUploader from "UTIL/aliyun/AliyunOssUploader";
import "LESS/components/picture-upload.less";
// import AuthorityHubSelect from 'COMPONENT/AuthorityHubSelect/index';
import AppSessionStorage from 'CONFIG/SessionStorage/AppSessionStorage';
// 业务相关
// import moment from 'moment';
// import getUserSignGiftList from "ACTION/ExpCenter/Supply/getUserSignGiftList";
import resetState from "ACTION/resetState";
import Mapping_Scene from "CONFIG/EnumerateLib/Mapping_Scene";
import returnSupplyDeposit from "ACTION/ExpCenter/Supply/returnSupplyDeposit";
import ossConfig from 'CONFIG/ossConfig';

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const IMG_PATH = ossConfig.getImgPath();

class SupplyDepositReturnModal extends React.PureComponent {
    constructor(props) {
        super(props);
        this.uploader = null;
        this.eRefundPayType = Mapping_Scene.eRefundPayType;
        this.eRefundPayTypeList = Object.keys(this.eRefundPayType).reverse();
        let HubIDList = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('HubIDList');
        if (HubIDList && HubIDList.length == 1) {
            this.hubID = HubIDList[0];
        }
    }

    componentWillMount() {

    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {
        let fetch = nextProps.supplyDetail.returnSupplyDepositFetch;
        if (fetch.status == 'success') {
            message.info('押金退回成功');
            this.handleCloseModal(true);
        }
        if (fetch.status == 'error') {
            let res = fetch.response;
            message.info('押金退回失败' + (res.Desc ? ':' + res.Desc : ''));
            setParams(nextProps.supplyDetail.state_name, {returnSupplyDepositFetch: {status: 'close'}});
        }
    }

    componentWillUpdate(nextProps, nextState) {

    }

    componentDidUpdate() {

    }

    componentWillUnmount() {

    }

    handleSetParam(key, value, paramName = 'returnData') {
        let data = this.props.supplyDetail;
        setParams(data.state_name, {[paramName]: Object.assign({}, data[paramName], {[key]: value})});
    }

    handleConfirm() {
        let data = this.props.supplyDetail;
        let info = Object.assign({}, data.returnData);
        if (this.hubID == undefined || this.hubID == null) {
            message.destroy();
            message.info('门店权限异常,请确认操作人员仅归属一个门店下');
            return;
        }
        if (!info.WorkCardPath) {
            message.info('请上传工牌图片');
            return;
        }
        // let HubID = data.authHubID;
        // let HubIDList = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('HubIDList');
        // if (data.authHubID == -9999) {
        //     if (HubIDList && HubIDList.length == 1) {
        //         HubID = HubIDList[0];
        //     }else{
        //         message.info('权限异常,未匹配');
        //         return;
        //     }
        // }
        let param = {
            PayType: info.PayType,
            WorkCardPath: info.WorkCardPath,
            Amount: data.SupplyReleaseData.Amount,
            GiftFeeID: data.SupplyReleaseData.GiftFeeID,
            RecruitID: data.SupplyReleaseData.RecruitID,
            UserID: data.SupplyReleaseData.UserID,
            UserOrderID: data.SupplyReleaseData.UserOrderID,
            HubID: this.hubID,
            EmployeeID: AppSessionStorage.getEmployeeID()
        };
        returnSupplyDeposit(param);
    }

    handleCloseModal(refresh) {
        let data = this.props.supplyDetail;
        resetState(data.state_name);
        this.props.closeModal(refresh);
    }

    handlePictureUpload(file) {
        if (!ossConfig.checkImage(file)) return;
        if (!this.uploader) this.uploader = new AliyunOssUploader();
        this.uploader.uploadFile(file, (res, message) => {
            if (res) {
                let data = this.props.supplyDetail;
                let returnData = Object.assign({}, data.returnData, {WorkCardPath: res.name});
                setParams(data.state_name, {returnData: returnData});
            } else {
                console.log('fail', message);
            }
        });
        return false;
    }

    render() {
        let data = this.props.supplyDetail;
        const fLayout = {
            labelCol: {span: 7},
            wrapperCol: {span: 17}
        };
        const {getFieldDecorator} = this.props.form;
        let info = data.returnData;
        return (
            <Modal
                width={600}
                title="退回押金"
                visible={true}
                onOk={() => this.handleConfirm()}
                onCancel={() => this.handleCloseModal()}
                okText="确认"
                cancelText="取消"
            >
                <Row><Col span={20} offset={2}>
                    <Form onSubmit={(e) => e.preventDefault()}>
                        <FormItem {...fLayout} label="会员名称">
                            <Input disabled value={data.SupplyReleaseData ? data.SupplyReleaseData.UserName : ''}/>
                        </FormItem>
                        <FormItem {...fLayout} label="上传工牌">
                            <Upload className="avatar-uploader" accept="image/jpeg,image/png"
                                    beforeUpload={(file) => this.handlePictureUpload(file)}
                                    name="avatar">
                                {info.WorkCardPath ? (<img src={IMG_PATH + info.WorkCardPath}/>) :
                                    (<Icon type="plus" className="avatar-uploader-trigger"/>)}
                            </Upload>
                        </FormItem>
                        {/* 暂时隐藏 */}
                        <FormItem {...fLayout} label="退款类型" className="display-none">
                            <RadioGroup value={info.PayType + ''}
                                        onChange={(e) => this.handleSetParam('PayType', e.target.value - 0)}>
                                {this.eRefundPayTypeList.map((key, index) => {
                                    return <RadioButton key={index}
                                                        value={key + ''}>{this.eRefundPayType[key]}</RadioButton>;
                                })}
                            </RadioGroup>
                        </FormItem>
                    </Form>
                </Col></Row>
            </Modal>
        );
    }
}


export default Form.create()(SupplyDepositReturnModal);