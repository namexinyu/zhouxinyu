import React from 'react';
import {Modal, message, Button, Upload, Row, Col, Icon} from 'antd';
import CustomForm from 'COMPONENT/SearchForm/CustomForm';
import setParams from "ACTION/setParams";
import uploadRule from 'CONFIG/uploadRule';
import getClient from 'COMPONENT/AliyunUpload/getClient';
import ossConfig from 'CONFIG/ossConfig';
import AliyunOssUploader from "UTIL/aliyun/AliyunOssUploader";
import moment from 'moment';
import "LESS/component/picture-upload.less";
import {RegexRule, Constant} from 'UTIL/constant/index';
import FactoryCheckinService from 'SERVICE/Broker/FactoryCheckinService';

const IMG_PATH = ossConfig.getImgPath(true);

export default class FactoryCheckinModal extends React.PureComponent {
    constructor(props) {
        super(props);
        let userInfo = props.userInfo;
        // console.log('userInfo.UserID constructor', userInfo);
        this.formItems = [
            {
                label: '预计到达时间',
                name: 'CheckInDate',
                itemType: 'DatePicker',
                rules: [{required: true, message: '请选择预计到达时间'}],
                itemConfig: {
                    showTime: {format: 'HH:mm'},
                    format: 'YYYY-MM-DD HH:mm',
                    disabledDate: (val) => val.format('YYYY-MM-DD') !== moment().format('YYYY-MM-DD')
                }
            },
            {
                name: 'Recruit',
                label: "企业",
                itemType: 'AutoCompleteInput',
                placeholder: '选择企业',
                valueKey: 'RecruitTmpID',
                textKey: 'RecruitName',
                rules: [{required: true, message: '请选择企业'}],
                dataArray: 'recruitFilterList'
            }
        ];
        if (userInfo.UUID) { // 认证会员
            this.formItems = [
                {
                    label: '真实姓名',
                    name: 'RealName',
                    itemType: 'Text',
                    value: userInfo.Name
                },
                {
                    label: '身份证',
                    name: 'IDCardNum',
                    itemType: 'Text',
                    value: userInfo.IDCardNum
                }
            ].concat(this.formItems);
        } else { // 非认证会员
            this.formItems = [
                {
                    label: '真实姓名',
                    name: 'RealName',
                    itemType: 'Input',
                    rules: [{required: true, pattern: RegexRule.noSpace, message: '请输入正确的姓名'}]
                },
                {
                    label: '身份证',
                    name: 'IDCardNum',
                    itemType: 'Input',
                    rules: [{required: true, pattern: RegexRule.idCard, message: '请输入正确的身份证号码'}]
                }
            ].concat(this.formItems);
        }
        getClient(uploadRule.idCardPic);
    }

    componentWillReceiveProps(nextProps) {
        let nData = nextProps.detail;
        let data = this.props.detail;
        // 图片处理
        let nPic = nData.PicPath;
        let pic = data.PicPath;
        let nPicBack = nPic.IDCardPicPathBack;
        let nPicFront = nPic.IDCardPicPathFront;
        let picBack = pic.IDCardPicPathBack;
        let picFront = pic.IDCardPicPathFront;
        // console.log('npic', nPicBack, nPicFront);
        // console.log('pic', picBack, picFront);
        if ((nPicBack && (nPicBack !== picBack)) || (nPicFront && (nPicFront !== picFront))) {
            // console.log('componentWillReceiveProps FactoryCheckinModal', nPic, pic);
            getClient(uploadRule.idCardPic).then((client) => {
                let ImageBack = nPicBack ? client.signatureUrl(nPicBack) : nPic.ImageBack;
                let ImageFront = nPicFront ? client.signatureUrl(nPicFront) : nPic.ImageFront;
                // console.log('FactoryCheckinModal client', ImageBack, ImageFront);
                setParams(nData.state_name, {
                    PicPath: Object.assign(
                        {}, nData.PicPath, {ImageBack: ImageBack, ImageFront: ImageFront}
                    )
                });
            });
        }
        // OCR
        let nOCR = nData.OCR;
        let OCR = data.OCR;
        if (nOCR.IDCardNum && nOCR.IDCardNum !== OCR.IDCardNum && (nData.Data.IDCardNum || {}).value !== nOCR.IDCardNum) {
            let strData = Object.assign({}, nData.Data);
            strData.IDCardNum.errors = [{message: "OCR:" + nOCR.IDCardNum, field: "IDCardNumOCR"}];
            setParams(nData.state_name, {Data: strData});
        }
    }

    handleOCR = () => {
        if (!this._child || !this._child.getForm) return;
        let form = this._child.getForm();
        // OCR识别
        let detail = this.props.detail;
        let {Data, OCR, PicPath} = this.props.detail;
        // let userInfo = this.props.userInfo;
        if (!PicPath.IDCardPicPathBack || !PicPath.IDCardPicPathFront) {
            message.destroy();
            message.info('请上传身份证');
            return;
        }
        form.validateFieldsAndScroll((errors, values) => {
            if (!errors) {
                setParams(detail.state_name, {OCR: Object.assign({}, OCR, {status: 'pending'})});
                FactoryCheckinService.callOCR({AliObjectName: PicPath.IDCardPicPathBack})
                    .then((res) => {
                        if (!res || res.error) return;
                        setParams(detail.state_name, {OCR: {IDCardNum: (res.Data || {}).IDCard, status: 'success'}});
                        message.destroy();
                        if ((res.Data || {}).IDCard && (res.Data || {}).IDCard === (Data.IDCardNum || {}).value) {
                            message.info("OCR识别结果与当前输入一致");
                        } else if ((res.Data || {}).IDCard && (res.Data || {}).IDCard !== (Data.IDCardNum || {}).value) {
                            message.warning("OCR识别结果与当前输入不一致，请核对");
                        } else {
                            message.warning("OCR识别无结果");
                        }
                    }, (err) => {
                        console.log(err);
                        setParams(detail.state_name, {OCR: {status: 'error'}});
                        message.destroy();
                        message.info('OCR识别失败' + (err && err.Desc ? ':' + err.Desc : ''));
                    });
            }
        });
    };

    handleModalConfirm = () => {
        if (!this._child || !this._child.getForm) return;
        let form = this._child.getForm();
        form.validateFieldsAndScroll((errors, values) => {
            console.log('errors', errors);
            if (errors && errors.IDCardNum) { // 忽略OCR提示性错误
                if (errors.IDCardNum.length == 1 && errors.IDCardNum[0].field.indexOf('OCR') > -1) {
                    delete errors.IDCardNum;
                }
            }
            if (!errors || Object.keys(errors).length > 0) {
                let {detail, userInfo} = this.props;
                let {Data, PicPath} = detail;
                let data = {};
                Object.keys(Data).forEach((key) => {
                    data[key] = Data[key].value;
                });
                if (!data.Recruit.value) {
                    message.destroy();
                    message.info('请选择一个企业');
                    return;
                }
                
                const param = {
                    RecruitTmpID: data.Recruit.value - 0,
                    Mobile: userInfo.Phone,
                    UserID: userInfo.UserID,
                    CheckInDate: moment(data.CheckInDate).format('YYYY-MM-DD HH:mm:ss')
                };
                if (userInfo.UUID) {
                    param.RealName = userInfo.Name;
                    param.IDCardNum = userInfo.IDCardNum;
                    param.IDCardPicPathBack = '';
                    param.IDCardPicPathFront = '';
                    param.UUID = userInfo.UUID;
                } else {
                    if (!PicPath.IDCardPicPathBack || !PicPath.IDCardPicPathFront) {
                        message.destroy();
                        message.info('请上传身份证照片');
                        return;
                    }
                    param.RealName = data.RealName;
                    param.IDCardNum = data.IDCardNum;
                    param.IDCardPicPathBack = PicPath.IDCardPicPathBack;
                    param.IDCardPicPathFront = PicPath.IDCardPicPathFront;
                    param.UUID = 0;
                }
                FactoryCheckinService.setFactoryCheckinData(param)
                    .then(
                        (res) => {
                            if (!res || res.error) return;
                            message.destroy();
                            message.info('设置厂门口接站成功');
                            this.handleModalCancel();
                        },
                        (err) => {
                            console.log(err);
                            message.destroy();
                            message.info('设置厂门口接站失败' + (err && err.Desc ? ':' + err.Desc : ''));
                        });
            }
        });

    };

    handleModalCancel = () => {
        let data = this.props.detail;
        setParams(data.state_name, {Data: undefined, PicPath: undefined});
    };

    handlePictureUpload = (file, key) => {
        if (!ossConfig.checkImage(file)) return;
        if (!this.uploader) this.uploader = new AliyunOssUploader(false);
        this.uploader.uploadFile(file, (res, message) => {
            if (res) {
                let detail = this.props.detail;
                let pic = Object.assign({}, detail.PicPath, {[key]: res.name});
                setParams(detail.state_name, {PicPath: pic});
            } else {
                message.info('图片上传失败');
                console.log('fail', message);
            }
        }, uploadRule.idCardPic.path);
        return false;
    };

    render() {
        let {detail, userInfo} = this.props;
        let allRecruitList = this.props.allRecruitList;
        let userMobileList = this.props.userMobileList;
        if (!detail.Data) return (<div className="display-none"></div>);
        const {IDCardPicPathBack, IDCardPicPathFront, ImageFront, ImageBack} = detail.PicPath;
        const {OCR} = detail;
        return (
            <Modal
                width={800}
                // confirmLoading={OCR && OCR.status === 'pending'}
                onOk={this.handleModalConfirm}
                onCancel={this.handleModalCancel}
                visible={true}
                footer={<div className="text-right">
                    <Button type="default" onClick={this.handleModalCancel}>取消</Button>
                    <Button type="primary"
                            loading={(OCR || {}).status === 'pending'}
                            visible={userInfo.UUID ? false : true}
                            disabled={(!userInfo.UUID && !(OCR || {}).IDCardNum) && (!ImageBack || !ImageFront)}
                            onClick={this.handleOCR}>
                        OCR识别
                    </Button>
                    <Button type="primary" onClick={this.handleModalConfirm}>提交</Button>
                </div>}
                title="厂门口接站">
                <CustomForm
                    ref={child => {
                        this._child = child;
                    }}
                    dataSource={{recruitFilterList: this.props.allRecruitList.recruitFilterList}}
                    itemSpan={12}
                    state_name={detail.state_name}
                    param_key={'Data'}
                    params={detail.Data}
                    formItems={this.formItems}
                />
                <Row className={"mt-16" + (userInfo.UUID ? ' display-none' : '')}>
                    <Col span={10} offset={2} className="text-center">身份证反面</Col>
                    <Col span={10} className="text-center">身份证正面</Col>
                </Row>
                <Row className={userInfo.UUID ? 'display-none' : ''}>
                    <Col span={20} offset={2}>
                        <Upload accept="image/jpeg,image/png"
                                className="avatar-uploader size-large float-left mr-16"
                                beforeUpload={(file) => this.handlePictureUpload(file, 'IDCardPicPathBack')}
                                name="avatar">
                            {ImageBack ? (<img style={{width: '300px', height: '300px'}}
                                               src={ImageBack}/>) :
                                <Icon type="plus" className="avatar-uploader-trigger"/>}
                        </Upload>
                        <Upload accept="image/jpeg,image/png"
                                className="avatar-uploader size-large float-left mr-16"
                                beforeUpload={(file) => this.handlePictureUpload(file, 'IDCardPicPathFront')}
                                name="avatar">
                            {ImageFront ? (<img style={{width: '300px', height: '300px'}}
                                                src={ImageFront}/>) :
                                <Icon type="plus" className="avatar-uploader-trigger"/>}
                        </Upload>
                    </Col>
                </Row>
            </Modal>
        );
    }

}