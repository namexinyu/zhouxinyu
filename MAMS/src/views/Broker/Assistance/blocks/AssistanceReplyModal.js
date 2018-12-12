import React from 'react';
import {Form, Row, Col, Button, Icon, Upload, Input, Select, Table, DatePicker, message, Modal, Alert} from 'antd';
import setParams from "ACTION/setParams";
import AppSessionStorage from "CONFIG/SessionStorage/AppSessionStorage";
import moment from 'moment';
import AliyunOssUploader from "UTIL/aliyun/AliyunOssUploader";
import resetState from 'ACTION/resetState';
import ossConfig from 'CONFIG/ossConfig';
import "LESS/component/picture-upload.less";
import GetEntrustReplyList from "ACTION/Common/Assistance/GetEntrustReplyList";
// 业务相关
import "LESS/pages/assistance-reply-modal.less";
import EnumAssistance from 'CONFIG/EnumerateLib/Mapping_Assistance';
import ReplyDepartEntrust from "ACTION/Common/Assistance/ReplyDepartEntrust";
import CloseDepartEntrust from "ACTION/Common/Assistance/CloseDepartEntrust";
import EvaluateDepartEntrust from "ACTION/Common/Assistance/EvaluateDepartEntrust";
import AssistanceService from "SERVICE/Common/AssistanceService";
import mams, {CurrentPlatformCode} from 'CONFIG/mamsConfig';
import uploadRule from 'CONFIG/uploadRule';


const FormItem = Form.Item;
const Search = Input.Search;
const Option = Select.Option;
const IMG_PATH = ossConfig.getImgPath();

class AssistanceReplyModal extends React.PureComponent {
    constructor(props) {
        super(props);
        this.eCloseStatus = Object.assign({}, EnumAssistance.eCloseStatus);
        this.eGradeLevel = Object.assign({}, EnumAssistance.eGradeLevel);
        this.EmployeeID = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('employeeId');
        this.AllDepartEnum = {};
        Object.keys(mams).forEach((key) => {
            this.AllDepartEnum[key] = mams[key].department;
        });
    }

    componentWillMount() {
        if (this.props.replyList.ReplyList.length == 0) {
            this.queryReplyList();
        }
    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {
        // if (nextProps.detail.ID != this.props.detail.ID && nextProps.detail.ID) {
        //     this.queryReplyList();
        // }
        let nRlist = nextProps.replyList.ReplyList;
        let nDdata = nextProps.detail.Data;
        if (nRlist != this.props.replyList.ReplyList && nRlist.length > 0) {
            // nDdata.SourceEmployeeID == this.EmployeeID &&
            if (nDdata.NoReadNum > 0) {
                let maxReplyID = nRlist.reduce((maxReplyID, item) => {
                    return item.EntrustReplyID > maxReplyID ? item.EntrustReplyID : maxReplyID;
                }, 0);
                AssistanceService.SetReplyReadStatus({
                    EntrustID: nDdata.EntrustID,
                    EntrustReplyID: maxReplyID,
                    MsgDir: nDdata.SourceEmployeeID == this.EmployeeID ? 1 : 2
                });
            }
        }
    }

    componentWillUpdate(nextProps, nextState) {
        let nd = nextProps.detail;
        let closeFetch = nd.CloseDepartEntrustFetch;
        let replyFetch = nd.ReplyDepartEntrustFetch;
        let gradeFetch = nd.EvaluateDepartEntrustFetch;
        if (closeFetch.status == 'success' && this.props.detail.CloseDepartEntrustFetch.status != 'success') {
            message.info("设置结案成功");
            this.hideModal();
        } else if (closeFetch.status == 'error' && this.props.detail.CloseDepartEntrustFetch.status != 'error') {
            let res = closeFetch.response;
            let text = '';
            if (res && res.Desc) text = ':' + res.Desc;
            message.info("设置结案失败" + text);
            setParams(nd.state_name, {CloseDepartEntrustFetch: {status: "close"}});
        }
        if (gradeFetch.status == 'success' && this.props.detail.EvaluateDepartEntrustFetch.status != 'success') {
            message.info("评价委托成功");
            this.hideModal();
        } else if (gradeFetch.status == 'error' && this.props.detail.EvaluateDepartEntrustFetch.status != 'error') {
            let res = closeFetch.response;
            let text = '';
            if (res && res.Desc) text = ':' + res.Desc;
            message.info("评价委托失败" + text);
            setParams(nd.state_name, {ReplyDepartEntrustFetch: {status: "close"}});
        }
        if (replyFetch.status == 'success' && this.props.detail.ReplyDepartEntrustFetch.status != 'success') {
            setParams(nd.state_name, {EvaluateDepartEntrustFetch: {status: "close"}});
            setParams(nd.state_name, {
                ReplyData: {
                    Content: '',
                    PicUrls: []
                }
            });
            this.hasNewReply = true;
            message.info("回复成功");
            this.queryReplyList();
        } else if (replyFetch.status == 'error' && this.props.detail.ReplyDepartEntrustFetch.status != 'error') {
            let res = closeFetch.response;
            let text = '';
            if (res && res.Desc) text = ':' + res.Desc;
            message.info("回复委托失败" + text);
            setParams(nd.state_name, {EvaluateDepartEntrustFetch: {status: "close"}});
        }
        if (nextProps.replyList.GetEntrustReplyListFetch.status == 'success' && this.props.replyList.GetEntrustReplyListFetch.status != 'success') {
            if (this.hasNewReply) this.checkScroll = true;
        }

    }


    componentDidUpdate() {
        // 用于优化交互，新增回复后，将回复列表滚动到底部
        if (this.checkScroll && this.hasNewReply) {
            setTimeout(() => {
                let replyContainerElm = document.getElementById('assistance-reply-container');
                if (replyContainerElm) replyContainerElm.scrollTop = replyContainerElm.scrollHeight;
                this.checkScroll = false;
                this.hasNewReply = false;
            }, 300);
        }
    }

    componentWillUnmount() {

    }

    queryReplyList() {
        GetEntrustReplyList({
            EntrustID: this.props.detail.ID,
            RecordIndex: 0,
            RecordSize: 999
        });
    }

    handleSetParam(key, value, paramName = 'ReplyData') {
        let data = this.props.detail;
        setParams(data.state_name, {[paramName]: Object.assign({}, data[paramName], {[key]: value})});
    }

    handleDoReply() {
        let pageData = this.props.detail;
        let ReplyData = pageData.ReplyData;
        if ((ReplyData.Content || '').length < 5) {
            message.info("回复内容不能少于五个字");
            return;
        }
        // 由于目前委托后台接口未完全考虑双向委托处理的问题，所以此处不作MsgDir的判断逻辑。
        ReplyDepartEntrust({
            EntrustID: pageData.Data.EntrustID,
            MsgDir: this.EmployeeID == pageData.Data.EntrustEmployeeID ? 1 : 2,
            PicUrls: ReplyData.PicUrls,
            Content: ReplyData.Content,
            EmployeeID: this.EmployeeID
        });
    }

    handleDoClose() {
        let pageData = this.props.detail;
        CloseDepartEntrust({
            EntrustID: pageData.Data.EntrustID,
            EmployeeID: this.EmployeeID
        });
    }

    handleDoGrade() {
        let pageData = this.props.detail;
        let GradeData = pageData.GradeData;
        // 由于目前委托后台接口未完全考虑双向委托处理的问题，所以此处不作MsgDir的判断逻辑。
        if (GradeData.Grade == "-9999") {
            message.info("请选择满意度");
            return;
        } else if (GradeData.Grade >= 3
            && ((GradeData.GradeComment || '').length < 5)) {
            message.info("请填写不满意信息，不少于五个字");
            return;
        }
        EvaluateDepartEntrust({
            EmployeeID: this.EmployeeID,
            EntrustID: pageData.Data.EntrustID,
            Grade: GradeData.Grade - 0,
            GradeComment: GradeData.Grade >= 3 ? GradeData.GradeComment : ''
        });
    }

    handlePictureRemove(index) {
        let data = this.props.detail;
        data.PicUrls[index].splice(index, 1);
        setParams(data.state_name, {PicUrls: [].concat(data.PicUrls)});
    }

    handlePictureUpload(file, index) {
        if (!ossConfig.checkImage(file)) return;
        if (!this.uploader) this.uploader = new AliyunOssUploader();
        this.uploader.uploadFile(file, (res, message) => {
            if (res) {
                let data = this.props.detail;
                let ReplyData = Object.assign({}, data.ReplyData);
                if (index) {
                    ReplyData.PicUrls[index] = res.name;
                    setParams(data.state_name, {ReplyData: ReplyData});
                } else {
                    ReplyData.PicUrls = ReplyData.PicUrls.concat([res.name]);
                    setParams(data.state_name, {ReplyData: ReplyData});
                }
            } else {
                message.info('图片上传失败');
                console.log('fail', message);
            }
        }, uploadRule.assistancePicture.path);
        return false;
    }

    hideModal() {
        resetState(this.props.detail.state_name);
        resetState(this.props.replyList.state_name);
    }

    handleClickImage(url) {
        if (url) window.open(url, '_blank');
    }

    render() {
        let data = this.props.detail;
        let replyList = this.props.replyList.ReplyList;
        let info = data.Data;
        if (!info) return (<div className="display-none"></div>);
        const fLayout = {
            labelCol: {span: 7},
            wrapperCol: {span: 17}
        };
        const timeStyle = {fontSize: '14px', lineHeight: '14px', paddingTop: '65px'};
        let otherText = '';
        if (info.UserName || info.UserMobile) {
            otherText += '会员:' + (info.UserName ? info.UserName + '-' : '') + info.UserMobile + ' ';
        }
        if (info.RecruitName) otherText += '关联企业:' + info.RecruitName + ' ';
        if (info.CheckinDate && moment(info.CheckinDate).isValid()) otherText += '签到日期:' + info.CheckinDate + ' ';
        return (
            <Modal width={720}
                   className="assistance-reply-modal"
                   title="委托详情"
                   onCancel={() => this.hideModal()}
                   visible={true}
                   footer={null}>
                {/* 委托内容 */}
                <div className="bg-white pl-16 pr-16">
                    <div>{`${this.AllDepartEnum[info.SourcePlatformCode]} - ${info.EntrustPerson} 提问：${otherText ? '  [' + otherText + ']' : ''}`}</div>
                    <div className="mt-8">{info.Content}</div>
                    <div className="mt-8 img-line mb-8">
                        <div className="float-left">
                            {Object.prototype.toString.call(info.PicUrls) === "[object Array]" ?
                                info.PicUrls.filter((url) => url != "").map((url, index) => {
                                    return <img className="size-sm mr-10"
                                                onClick={() => this.handleClickImage(IMG_PATH + url)}
                                                key={index} src={IMG_PATH + url}/>;
                                }) : ''}
                        </div>
                        <div className="float-right time-text">
                            {info.CreateTime ? moment(info.CreateTime).format("YYYY-MM-DD HH:mm") : ''}
                        </div>
                    </div>
                </div>
                <div id="assistance-reply-container" className="bg-e5 pl-16 pr-16 pl-8 pr-8 reply-container">
                    {replyList.map((item, index) => {
                        if (item.EmployeeID == info.EntrustEmployeeID) {
                            return (
                                <Row key={index} gutter={15}>
                                    <Col span={4} className="gutter-box">
                                        <div className="reply-chunk from-source">{item.EmployeeName}</div>
                                    </Col>
                                    <Col span={16} className="gutter-box">
                                        <div className="reply-chunk from-source">
                                            {item.Content}
                                            <div className="img-line">
                                                <div className="float-left">
                                                    {Object.prototype.toString.call(item.PicUrls) === "[object Array]" ?
                                                        item.PicUrls.filter((url) => url != "").map((url, index) => {
                                                            return <img className="size-sm mr-10" key={index}
                                                                        onClick={() => this.handleClickImage(IMG_PATH + url)}
                                                                        src={IMG_PATH + url}/>;
                                                        }) : ''}
                                                </div>
                                                <div className="float-right time-text">
                                                    {item.CreateTime ? moment(item.CreateTime).format("YYYY-MM-DD HH:mm") : ''}
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            );
                        } else {
                            return (
                                <Row key={index} gutter={15}>
                                    <Col span={16} offset={4} className="gutter-box">
                                        <div className="reply-chunk from-target">
                                            {item.Content}
                                            <div className="img-line">
                                                <div className="float-left">
                                                    {Object.prototype.toString.call(item.PicUrls) === "[object Array]" ?
                                                        item.PicUrls.filter((url) => url != "").map((url, index) => {
                                                            return <img className="size-sm mr-10" key={index}
                                                                        onClick={() => this.handleClickImage(IMG_PATH + url)}
                                                                        src={IMG_PATH + url}/>;
                                                        }) : ''}
                                                </div>
                                                <div className="float-right time-text">
                                                    {item.CreateTime ? moment(item.CreateTime).format("YYYY-MM-DD HH:mm") : ''}
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col span={4} className="gutter-box">
                                        <div className="reply-chunk from-target">{item.EmployeeName}</div>

                                    </Col>
                                </Row>
                            );
                        }
                    })}
                </div>
                {/* 回复对话框 */}
                <div className="pl-16 pr-16 pb-8 pt-8">
                    {this.modalBottom()}
                </div>
                {/* 底部(委托人，回复或评价；处理人，回复或结案) */}
            </Modal>
        );
    }

    modalBottom() {
        let data = this.props.detail;
        let info = data.Data;
        let isOrigin = this.EmployeeID == data.Data.EntrustEmployeeID;
        const fLayout = {
            labelCol: {span: 8},
            wrapperCol: {span: 16}
        };
        if (info.CloseStatus == 2) { // 未结案
            let ReplyData = data.ReplyData;
            return (
                <Form>
                    <div className="img-line mb-8">
                        <div className="float-left">
                            <div className="float-left mr-16">
                                <Upload accept="image/jpeg,image/png"
                                        beforeUpload={(file) => this.handlePictureUpload(file)}>
                                    <div className="upload-icon">
                                        <Icon className="mr-8" type="upload"/>上传图片
                                    </div>
                                </Upload>

                            </div>
                            {(ReplyData.PicUrls || []).length > 0 ? (
                                <div className="float-left mr-16">
                                    <div className="remove-icon"
                                         onClick={() => this.handleSetParam('PicUrls', [], 'ReplyData')}>
                                        <Icon type="delete"/>
                                    </div>
                                </div>
                            ) : ''}
                            {ReplyData.PicUrls.map((url, index) => {
                                return <img className="mr-10"
                                            onClick={() => this.handleClickImage(IMG_PATH + url)}
                                            key={index} src={IMG_PATH + url}/>;
                            })}
                        </div>
                    </div>
                    <Row gutter={15}>
                        <Col className="gutter-box" span={isOrigin ? 24 : 20}>
                            <FormItem className="reply-input">
                                <Input placeholder="输入回复内容(至少五个字)" value={ReplyData.Content}
                                       maxLength="120"
                                       addonAfter={(
                                           <div onClick={() => this.handleDoReply()}>{isOrigin ? "追问" : "发送"}</div>)}
                                       onChange={(e) => this.handleSetParam("Content", e.target.value, "ReplyData")}/>
                            </FormItem>
                        </Col>
                        <Col className={`gutter-box text-right${isOrigin ? " display-none" : ''}`}
                             span={4}>
                            <FormItem>
                                <Button type="primary"
                                        disabled={this.EmployeeID != info.HandleEmployeeID}
                                    // style={{color: "#ffffff", borderColor: "none !important"}}
                                        onClick={() => this.handleDoClose()}
                                        htmlType="button">结案</Button>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>);
        }
        else if (info.CloseStatus == 1) { // 已结案
            if (isOrigin) {
                let grade = data.GradeData;
                return (
                    <Form className={this.EmployeeID == data.Data.EntrustEmployeeID}>
                        <FormItem className="reply-input">
                            <Row className="mb-8">
                                <Col span={16} offset={4}>
                                    <Alert message="处理人已结案，请对处理人的回答作出合理的评价吧" type="info"/>
                                </Col>
                            </Row>
                            <Row gutter={15}>
                                <Col className="gutter-box" span={8}>
                                    <FormItem {...fLayout} label="满意度">
                                        <Select value={grade.Grade}
                                                onChange={(value) => this.handleSetParam("Grade", value, "GradeData")}>
                                            <Option value="-9999">请选择</Option>
                                            {Object.keys(this.eGradeLevel).map((key, index) => {
                                                return (
                                                    <Option key={index} value={key + ''}>
                                                        {this.eGradeLevel[key]}
                                                    </Option>);
                                            })}
                                        </Select>
                                    </FormItem>
                                </Col>
                                <Col className="gutter-box" span={12}>
                                    <FormItem className={grade.Grade >= 3 ? '' : 'display-none'}>
                                        <Input placeholder="请填写不满意原因(不少于五个字)" maxLength="30"
                                               onChange={(e) => this.handleSetParam("GradeComment", e.target.value, "GradeData")}/>
                                    </FormItem>
                                </Col>
                                <Col className="gutter-box" span={4}>
                                    <Button type="primary" htmlType="button"
                                            onClick={() => this.handleDoGrade()}>评价</Button>
                                </Col>
                            </Row>
                        </FormItem>
                    </Form>);
            } else {
                return (
                    <Form className={this.EmployeeID == data.Data.EntrustEmployeeID}>
                        <FormItem className="reply-input">
                            <Row>
                                <Col span={16} offset={4}>
                                    <Alert message="本委托已结案" type="info"/>
                                </Col>
                            </Row>
                        </FormItem>
                    </Form>);
            }
        }
        return '';
    }
}

export default AssistanceReplyModal;