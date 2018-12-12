import React from 'react';
import {Form, Row, Col, Button, Icon, Upload, Input, Select, Table, DatePicker, message, Modal} from 'antd';
import setParams from "ACTION/setParams";
import {CONFIG} from 'mams-com';
const {AppSessionStorage} = CONFIG;
import AliyunOssUploader from "UTIL/aliyun/AliyunOssUploader";
import resetState from 'ACTION/resetState';
import ossConfig from 'CONFIG/ossConfig';
import "LESS/component/picture-upload.less";
import BuildDepartEntrust from "ACTION/Common/Assistance/BuildDepartEntrust";
import uploadRule from 'CONFIG/uploadRule';
// 业务相关
import mams, {CurrentPlatformCode} from 'CONFIG/mamsConfig';

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

    handleClickConfirm() {
        this.props.form.validateFieldsAndScroll((errors, values) => {
            if (!errors) {
                let data = this.props.asNew;
                BuildDepartEntrust({
                    EmployeeID: AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('employeeId'),
                    // SourceDepartID: AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem("DepartmentID") || 4,
                    SourcePlatformCode: CurrentPlatformCode,
                    EntrustType: 1,
                    PicUrls: data.PicUrls,
                    // 部门委托变更，经纪人可以关联会员,企业,签到日期
                    CheckinDate: '',
                    UserID: 0,
                    RecruitID: 0,
                    Content: data.Data.Content.value,
                    // TargetDepartID: data.Data.TargetDepartID.value - 0
                    TargetPlatformCode: data.Data.TargetDepartID.value
                });
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
        // let departmentFilterList = this.props.departmentFilterList;
        return (
            <Modal width={640}
                   title="新建委托"
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
                            <FormItem {...fLayout} label="委托内容">
                                {getFieldDecorator("Content", {
                                    rules: [{
                                        required: true,
                                        pattern: /^.{5,200}$/,
                                        message: '委托内容不能少于五个字'
                                    }]
                                })(
                                    <Input.TextArea autosize={{minRows: 4, maxRows: 8}} maxLength="120"
                                                    placeholder="请输入委托内容"></Input.TextArea>
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