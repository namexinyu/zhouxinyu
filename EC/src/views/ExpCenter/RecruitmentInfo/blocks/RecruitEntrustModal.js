import React from 'react';
import {Row, Col, Card, Form, Select, Icon, Button, Input, Upload, Modal, message} from 'antd';
import setParams from "ACTION/setParams";
import mams, {CurrentPlatformCode} from 'CONFIG/mamsConfig';
import AppSessionStorage from "CONFIG/SessionStorage/AppSessionStorage";
import AliyunOssUploader from "UTIL/aliyun/AliyunOssUploader";
import ossConfig from 'CONFIG/ossConfig';
import uploadRule from 'CONFIG/uploadRule';
import "LESS/components/picture-upload.less";
import ActionMAMSRecruitment from 'ACTION/Common/Recruitment/ActionMAMSRecruitment';
import resetState from "ACTION/resetState";

const FormItem = Form.Item;
const IMG_PATH = ossConfig.getImgPath();

export default class RecruitEntrustModal extends React.PureComponent {
    constructor(props) {
        super(props);
        this.EmployeeID = AppSessionStorage.getEmployeeID();
    }

    handlePictureUpload(file, index) {
        if (!ossConfig.checkImage(file)) return;
        if (!this.uploader) this.uploader = new AliyunOssUploader();
        this.uploader.uploadFile(file, (res, message) => {
            if (res) {
                let data = this.props.entrust;
                if (index) {
                    data.PicUrls[index] = res.name;
                    setParams(data.state_name, {PicUrls: [].concat(data.PicUrls)});
                } else {
                    setParams(data.state_name, {PicUrls: data.PicUrls.concat([res.name])});
                }
            } else {
                message.info('图片上传失败');
                console.log('fail', message);
            }
        }, uploadRule.assistancePicture.path);
        return false;
    }

    handleModalConfirm() {
        let data = this.props.entrust;
        if ((data.Content || '').length < 5) {
            message.info('委托内容不能少于五个字');
            return;
        }
        if (CurrentPlatformCode != 'broker') {
            message.info("当前平台没有纠错权限");
            return;
        }
        let param = {
            EmployeeID: this.EmployeeID,
            EntrustType: 2,
            Content: data.Content,
            PicUrls: data.PicUrls,
            SourcePlatformCode: CurrentPlatformCode,
            TargetPlatformCode: 'biz'
        };
        ActionMAMSRecruitment.BuildRecruitmentEntrust(param);
    }

    handleModalClose() {
        resetState(this.props.entrust.state_name);
    }


    render() {
        let data = this.props.entrust;
        let info = data.Data;
        if (!info) return (<div className="display-none"></div>);
        const fLayout = {
            labelCol: {span: 7},
            wrapperCol: {span: 17}
        };
        return (
            <Modal width={640} title="企业纠错"
                   visible={true}
                   onOk={() => this.handleModalConfirm()}
                   onCancel={() => this.handleModalClose()}>
                <Form>
                    <Row>
                        <Col span={20} offset={2}>
                            <FormItem {...fLayout} label="企业名称">
                                <Input value={info.PositionName} disabled/>
                            </FormItem>
                            <FormItem {...fLayout} label="纠错内容">
                                <Input.TextArea value={data.Content}
                                                onChange={(e) => setParams(data.state_name, {Content: e.target.value})}
                                                autosize={{minRows: 6, maxRows: 10}}/>
                            </FormItem>
                            <FormItem {...fLayout} label="上传图片">
                                {data.PicUrls && data.PicUrls.length > 0 ? data.PicUrls.map((url, index) => {
                                    return (
                                        <Upload accept="image/jpeg,image/png"
                                                className="avatar-uploader size-small float-left mr-16" key={index}
                                                onRemove={() => this.handlePictureRemove(index)}
                                                beforeUpload={(file) => this.handlePictureUpload(file, index)}
                                                name="avatar">
                                            <img style={{width: '100px', height: '100px'}} src={IMG_PATH + url}/>
                                        </Upload>);
                                }) : ''}
                                {(data.PicUrls || []).length >= 5 ? '' : (
                                    <Upload accept="image/jpeg,image/png"
                                            className="avatar-uploader size-small float-left"
                                            beforeUpload={(file) => this.handlePictureUpload(file)}
                                            name="avatar">
                                        <Icon type="plus" className="avatar-uploader-trigger"/>
                                    </Upload>)}
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Modal>);
    }
}