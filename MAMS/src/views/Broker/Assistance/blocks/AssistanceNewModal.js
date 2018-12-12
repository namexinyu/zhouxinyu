import React from 'react';
import {Form, Row, Col, Button, Icon, Upload, Input, Select, Table, DatePicker, message, Modal} from 'antd';
import setParams from "ACTION/setParams";
import AppSessionStorage from "CONFIG/SessionStorage/AppSessionStorage";
import AliyunOssUploader from "UTIL/aliyun/AliyunOssUploader";
import resetState from 'ACTION/resetState';
import ossConfig from 'CONFIG/ossConfig';
import "LESS/component/picture-upload.less";
import BuildDepartEntrust from "ACTION/Common/Assistance/BuildDepartEntrust";
import uploadRule from 'CONFIG/uploadRule';
import moment from 'moment';
import regexRule from 'UTIL/constant/regexRule';
import AutoCompleteSelect from 'COMPONENT/AutoCompleteSelect';
// 业务相关
import mams, {CurrentPlatformCode} from 'CONFIG/mamsConfig';
import getRecruitNameList from 'ACTION/Broker/Recruit/getRecruitNameList';
import AssistanceService from 'SERVICE/Common/AssistanceService';

const FormItem = Form.Item;
const Option = Select.Option;
const IMG_PATH = ossConfig.getImgPath();

class AssistanceNewModal extends React.PureComponent {
    constructor(props) {
        super(props);
        this.TargetDepartmentList = Object.keys(mams)
            .filter((key) => mams[key].acceptAssistance && key != CurrentPlatformCode)
            .map((key) => ({DepartID: key, DepartName: mams[key].department}));

    }

    componentWillMount() {
        getRecruitNameList();
    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {
        let nextInfo = nextProps.asNew.Data;
        let curInfo = this.props.asNew.Data;
        if (nextInfo && curInfo && regexRule.mobile.test(nextInfo.Mobile.value) && !regexRule.mobile.test(curInfo.Mobile.value)) {
            AssistanceService.QueryUserInfo({Mobile: nextInfo.Mobile.value}).then(
                (res) => {
                    if (res && res.Data && res.Data.UserInforList && res.Data.UserInforList.length > 0) {
                        let User = res.Data.UserInforList[0];
                        setParams(nextProps.asNew.state_name, {User: User});
                        message.info('关联会员成功');
                    } else {
                        message.info('帐号下未匹配到该手机号的会员');
                    }
                }, (err) => {
                    console.log(err);
                });
        }

        let nextData = nextProps.asNew;
        let nowData = this.props.asNew;
        let nextFetch = nextData.BuildDepartEntrustFetch;
        let nowFetch = nowData.BuildDepartEntrustFetch;
        if (nextFetch.status == 'success' && nowFetch.status != 'success') {
            message.info("新增施令成功");
            resetState(nextData.state_name);
        } else if (nextFetch.status == 'error' && nowFetch.status != 'error') {
            let res = nextFetch.response;
            let text = '';
            if (res && res.Desc) text = ':' + res.Desc;
            message.info("新增施令失败" + text);
            setParams(nextData.state_name, {BuildDepartEntrustFetch: {status: "close"}});
        }
    }

    componentWillUpdate(nextProps, nextState) {

    }

    componentDidUpdate() {

    }

    componentWillUnmount() {

    }

    handleClickConfirm() {
        this.props.form.validateFieldsAndScroll((errors, values) => {
            if (!errors) {
                let data = this.props.asNew;
                let CheckinDate = data.Data.CheckinDate.value;
                let Recruit = data.Data.Recruit.value || {};
                if (Recruit.text && !Recruit.value) {
                    message.info('若需关联企业，请选择企业');
                    return;
                }
                let User = data.User || {};
                if (data.Data.Mobile.value && !User.UserID) {
                    message.info('若需关联帐号下会员，请输入有效的手机号');
                    return;
                }
                BuildDepartEntrust({
                    EmployeeID: AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('employeeId'),
                    // SourceDepartID: AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem("DepartmentID") || 4,
                    SourcePlatformCode: CurrentPlatformCode,
                    Source: 2,
                    EntrustType: 1,
                    PicUrls: data.PicUrls,
                    Content: data.Data.Content.value,
                    UserID: data.User ? data.User.UserID : 0,
                    RecruitID: Recruit.value ? Recruit.value - 0 : 0,
                    CheckinDate: CheckinDate && moment(CheckinDate).isValid() ? CheckinDate.format('YYYY-MM-DD') : '',
                    // TargetDepartID: data.Data.TargetDepartID.value - 0
                    TargetPlatformCode: data.Data.TargetDepartID.value
                })
                ;
            }
        });
    }

    handlePictureRemove(index) {
        let data = this.props.asNew;
        data.PicUrls[index].splice(index, 1);
        setParams(data.state_name, {PicUrls: [].concat(data.PicUrls)});
    }

    handlePictureUpload(file, index) {
        if (!ossConfig.checkImage(file)) return;
        if (!this.uploader) this.uploader = new AliyunOssUploader();
        this.uploader.uploadFile(file, (res, message) => {
            if (res) {
                let data = this.props.asNew;
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

    hideModal() {
        resetState(this.props.asNew.state_name);
    }

    render() {
        let data = this.props.asNew;
        if (!data.showModal) return (<div className="display-none"></div>);
        const {getFieldDecorator} = this.props.form;
        const fLayout = {
            labelCol: {span: 7},
            wrapperCol: {span: 17}
        };
        let recruitNameList = this.props.recruitNameList;
        // let departmentFilterList = this.props.departmentFilterList;
        return (
            <Modal width={640}
                   title="新建施令"
                   visible={true}
                   onOk={() => this.handleClickConfirm()}
                   onCancel={() => this.hideModal()}
                   okText="确认"
                   cancelText="取消">
                <Form>
                    <Row>
                        <Col span={20} offset={2}>
                            <FormItem {...fLayout} label="选择部门">
                                {getFieldDecorator("TargetDepartID", {
                                    rules: [{
                                        required: true,
                                        pattern: /^[a-zA-Z0-9]*$/,
                                        message: '请选择一个部门'
                                    }]
                                })(
                                    <Select>
                                        <Option value="-9999">请选择</Option>
                                        {this.TargetDepartmentList.map((item, index) => {
                                            return <Option key={index}
                                                           value={item.DepartID + ''}>{item.DepartName}</Option>;
                                        })}
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={20} offset={2}>
                            <FormItem {...fLayout} label="选择会员">
                                {getFieldDecorator("Mobile", {
                                    rules: [{
                                        pattern: regexRule.mobile,
                                        message: '请输入正确的手机号'
                                    }]
                                })(
                                    <Input placeholder="请输入手机号"></Input>
                                )}
                            </FormItem>
                        </Col>
                        {data.User ?
                            <Col span={20} offset={2}>
                                <FormItem {...fLayout} label="关联会员">
                                    <Input value={data.User.UserName + '(' + data.User.Mobile + ')'} disabled></Input>
                                </FormItem>
                            </Col> : ''}
                        <Col span={20} offset={2}>
                            <FormItem {...fLayout} label="关联企业">
                                {getFieldDecorator("Recruit", {})(
                                    <AutoCompleteSelect
                                        allowClear={true}
                                        placeholder="请选择企业"
                                        optionsData={{
                                            valueKey: 'RecruitID',
                                            textKey: 'RecruitName',
                                            dataArray: recruitNameList || []
                                        }}
                                    ></AutoCompleteSelect>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={20} offset={2}>
                            <FormItem {...fLayout} label="签到日期">
                                {getFieldDecorator("CheckinDate", {})(
                                    <DatePicker placeholder="选择日期"></DatePicker>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={20} offset={2}>
                            <FormItem {...fLayout} label="施令内容">
                                {getFieldDecorator("Content", {
                                    rules: [{
                                        required: true,
                                        pattern: /^.{5,200}$/,
                                        message: '施令内容不能少于五个字'
                                    }]
                                })(
                                    <Input.TextArea autosize={{minRows: 4, maxRows: 8}}
                                                    maxLength="120"
                                                    placeholder="请输入施令内容"></Input.TextArea>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={20} offset={2}>
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
            </Modal>
        );
    }
}

export default Form.create({
    mapPropsToFields: (props) => Object.assign({}, props.asNew.Data),
    onFieldsChange: (props, fields) => setParams(props.asNew.state_name, {Data: Object.assign({}, props.asNew.Data, fields)})
})(AssistanceNewModal);