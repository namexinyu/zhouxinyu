import React from 'react';
import {browserHistory} from 'react-router';
import setParams from 'ACTION/setParams';
import openDialog from 'ACTION/Dialog/openDialog';
import Mapping_CallType from 'CONFIG/EnumerateLib/Mapping_CallType';
import Mapping_NeedTodoType from 'CONFIG/EnumerateLib/Mapping_NeedTodoType';
import getMemberContactRecord from 'ACTION/Broker/MemberDetail/getMemberContactRecord';
import getMemberScheduleMessageList from 'ACTION/Broker/MemberDetail/getMemberScheduleMessageList';
import getMemberDemandsInfo from 'ACTION/Broker/MemberDetail/getMemberDemandsInfo';
import getRecruitSimpleList from 'ACTION/Common/getRecruitSimpleList';
import getStoreList from 'ACTION/Common/getStoreList';
import getMemberEstimateApplyList from 'ACTION/Broker/MemberDetail/getMemberEstimateApplyList';
import createDispatchOrder from 'ACTION/Broker/MemberDetail/createDispatchOrder';
import setFetchStatus from "ACTION/setFetchStatus";
import closeMemberApply from 'ACTION/Broker/MemberDetail/closeMemberApply';
import replyFeedback from 'ACTION/Broker/MemberDetail/replyFeedback';
import renewMemberApply from 'ACTION/Broker/MemberDetail/renewMemberApply';
import getMemberStatusRecord from 'ACTION/Broker/MemberDetail/getMemberStatusRecord';
import getPickupLocationList from 'ACTION/Broker/MemberDetail/getPickupLocationList';
import answerKA from 'ACTION/Broker/MemberDetail/answerKA';
import resetState from 'ACTION/resetState';
import moment from 'moment';
import AutoCompleteSelect from 'COMPONENT/AutoCompleteSelect';
import helpMemberApply from 'ACTION/Broker/MemberDetail/helpMemberApply';
import createMemberApply from 'ACTION/Broker/MemberDetail/createMemberApply';
import PocketAction from 'ACTION/Broker/Pocket';
import getLatestEnrollRecord from 'ACTION/Broker/MemberDetail/getLatestEnrollRecord';
import patchProcessDemands from 'ACTION/Broker/MemberDetail/patchProcessDemands';
import ossConfig from 'CONFIG/ossConfig';
import MemberDetailService from 'SERVICE/Broker/MemberDetailService';
import AppSessionStorage from 'CONFIG/SessionStorage/AppSessionStorage';


import stateObjs from "VIEW/StateObjects";

const {
    getLatestPocketCase,
    updatePocketCase,
    setEstimatePick,
    setPocketCase,
    insertMemberEnrollRecord
} = PocketAction;

import {
    Button,
    Icon,
    Row,
    Col,
    Modal,
    message,
    Table,
    Select,
    Card,
    Form,
    Input,
    Collapse,
    DatePicker,
    Cascader,
    Tag
} from 'antd';

const {TextArea} = Input;
const FormItem = Form.Item;
const {Option} = Select;
const Panel = Collapse.Panel;
const {Column, ColumnGroup} = Table;

const IMG_PATH = ossConfig.getImgPath();

let cardBodyStyle = {
    height: '240px',
    overflowY: 'auto',
    overflowX: 'hidden'
};

const QuestionTypeMap = {
  1: '问情况',
  2: '问吃住',
  3: '晒工资',
  4: '晒妹子'
};

const STATE_NAME = 'state_broker_member_detail_process';
const STATE_NAME_POCKET = 'state_broker_detail_pocket';

class BlockDetailProcess extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            showSendLocation: false
        };
    }

    componentWillMount() {
        setFetchStatus(STATE_NAME, 'createDispatchOrderFetch', 'close');
        setFetchStatus(STATE_NAME_POCKET, 'setPocketCaseFetch', 'close');
        if ((this.props.userId + '') !== ((this.props.editPocketUserID || {}).value + '')) {
            setParams(STATE_NAME, {editPocketUserID: {value: this.props.userId + ''}});
        }
        getPickupLocationList();
        getStoreList();
    }

    shouldComponentUpdate() {
        return true;
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.createDispatchOrderFetch.status === 'success') {
            setFetchStatus(STATE_NAME, 'createDispatchOrderFetch', 'close');
            message.success('派单成功');
            setParams(STATE_NAME, {
                currentProcessStep: '',
                pickupLocation: '',
                sendLocation: '',
                sendLocationId: '',
                buddyNumber: '',
                createDispatchOrderFetch: {
                    status: 'close',
                    response: ''
                }
            });
            // this.getMemberContactRecord(nextProps);
            this.getMemberStatusRecord(nextProps);
        }
        if (nextProps.createDispatchOrderFetch.status === 'error') {
            setFetchStatus(STATE_NAME, 'createDispatchOrderFetch', 'close');
            Modal.error({
                title: window.errorTitle.normal,
                content: nextProps.createDispatchOrderFetch.response.Desc
            });
        }

        if (nextProps.answerKAFetch.status === 'success') {
            setFetchStatus(STATE_NAME, 'answerKAFetch', 'close');
            message.success('回复成功');
            setParams(STATE_NAME, {
                currentProcessItem: '',
                showKAAnswer: false,
                answerKAContent: {}
            });
            // this.getMemberContactRecord(nextProps);
            this.getMemberStatusRecord(nextProps);

            // 重新拉取会员需求列表
            getMemberDemandsInfo({
              BrokerID: this.props.brokerId,
              UserID: this.props.userId,
              RecordIndex: 0,
              RecordSize: 900000
            });

            // 取消客户端提醒
            MemberDetailService.cancelClientPush({
                BrokerID: this.props.brokerId,
                UserID: this.props.userId,
                UserName: this.props.userName,
                Type: 5
            });
        }
        if (nextProps.answerKAFetch.status === 'error') {
            setFetchStatus(STATE_NAME, 'answerKAFetch', 'close');
            Modal.error({
                title: window.errorTitle.normal,
                content: nextProps.answerKAFetch.response.Desc
            });
        }

        if (nextProps.pocketInfo.insertMemberEnrollRecordFetch.status === 'success' && this.props.pocketInfo.insertMemberEnrollRecordFetch.status !== 'success') {
            setFetchStatus(STATE_NAME_POCKET, 'insertMemberEnrollRecordFetch', 'close');
            setParams(STATE_NAME, {
                editPocketRemark: {},
                editPocketDate: {},
                editPocketRecruit: {},
                currentProcessItem: '',
                currentProcessStep: ''
            });
            message.success('成功放进口袋');

            // 重新拉取口袋属性信息
            getLatestEnrollRecord({
              BrokerID: this.props.brokerId,
              UserID: this.props.userId,
              CaseStatus: 1
            });

            // this.getMemberContactRecord(nextProps);
            this.getMemberStatusRecord(nextProps);
        }

        if (nextProps.pocketInfo.insertMemberEnrollRecordFetch.status === 'error' && this.props.pocketInfo.insertMemberEnrollRecordFetch.status !== 'error') {
            setFetchStatus(STATE_NAME_POCKET, 'insertMemberEnrollRecordFetch', 'close');
            Modal.error({
                title: window.errorTitle.normal,
                content: nextProps.pocketInfo.insertMemberEnrollRecordFetch.response.Desc || '装进口袋失败'
            });
        }

        if (nextProps.patchProcessDemandsFetch.status === 'success') {
            setFetchStatus(STATE_NAME, 'patchProcessDemandsFetch', 'close');

            // 取消客户端提醒
            MemberDetailService.cancelClientPush({
                BrokerID: this.props.brokerId,
                UserID: this.props.userId,
                UserName: this.props.userName,
                Type: 0
            });
        }

        if (nextProps.patchProcessDemandsFetch.status === 'error') {
            setFetchStatus(STATE_NAME, 'patchProcessDemandsFetch', 'close');

            Modal.error({
                title: window.errorTitle.normal,
                content: nextProps.patchProcessDemandsFetch.response.Desc
            });
        }
    }

    handleInputChange(e, paramKey) {
        let temp = {};
        if (paramKey === 'contactStartTime' || paramKey === 'contactEndTime') {
            temp[paramKey] = e ? new Date(e.format('YYYY-MM-DD')) : null;
        } else {
            temp[paramKey] = e.target.value;
        }
        setParams(STATE_NAME, temp);
    }


    handleSelectStore(item) {
        setParams(STATE_NAME, {
            sendLocationId: item.HubID,
            sendLocation: item.HubName
        });
        this.setState({
            showSendLocation: false
        });
    }

    handleStoreBlur(e) {
        if (!e.target.value) {
            setParams(STATE_NAME, {
                sendLocationId: '',
                sendLocation: ''
            });
        }
    }

    handleFocus(value) {
        if (value === 2) {
            this.setState({
                showSendLocation: true
            });
        }
    }

    matchStore(key, array) {
        let result = [];
        if (key) {
            for (let i = 0; i < array.length; i++) {
                if (escape(array[i].HubName).match(escape(key)) || escape(key).match(escape(array[i].HubName))) {
                    result.push(array[i]);
                }
            }
        }
        return result;
    }

    getMemberScheduleMessageList(props) {
        getMemberScheduleMessageList({
            UserID: props.userId
        });
    }

    getMemberStatusRecord(props) {
        getMemberStatusRecord({
            UserID: props.userId,
            brokerId: this.props.brokerId
        });
    }

    getMemberContactRecord(props) {
        getMemberContactRecord({
          BrokerID: props.brokerId,
          UserID: props.userId,
          RecordIndex: props.contactIndex,
          RecordSize: props.contactPageSize,
          StartTime: new Date(props.contactStartTime).Format('yyyy-MM-dd hh:mm:ss'),
          EndTime: new Date(props.contactEndTime.getFullYear(), props.contactEndTime.getMonth(), props.contactEndTime.getDate() + 1, 0, 0, 0).Format('yyyy-MM-dd hh:mm:ss')
        });
    }

    handleModalSendBusOk() {
        this.props.form.validateFieldsAndScroll(['sendLocation', 'pickupLocation', 'buddyNumber'], (errors, values) => {
            if (!errors) {
                if (this.props.sendBusConfirmContact && this.props.sendBusConfirmContact.value) {
                    replyFeedback({
                        UserID: this.props.userId,
                        ReplyInfo: [{
                            Content: this.props.sendBusConfirmContact.value,
                            MsgFlowID: this.props.currentProcessItem.MsgFlowID,
                            // Type: this.props.currentProcessItem.Type,
                            Type: Mapping_NeedTodoType.needTodoTypeMapperToCallType[this.props.currentProcessItem.Type],
                            UserStatus: this.props.currentProcessItem.Status
                        }]
                    });
                }
                createDispatchOrder({
                    BuddyNum: parseInt(this.props.buddyNumber.value || 0, 10),
                    PickupLocate: this.props.pickupLocation.value.text,
                    DestinationID: parseInt(this.props.sendLocation.value.value, 10),
                    RecruitID: this.props.currentEstimateApply.RecruitID || 0,
                    Name: this.props.userName,
                    UserID: this.props.userId,
                    Phone: this.props.userPhone,
                    UserOrderID: this.props.currentEstimateApply.UserOrderID || 0,
                    CarryTime: '',
                    SourceKeyID: this.props.currentProcessItem.SourceKeyID || 0
                });
            }
        });
    }

    handleModalSendBusCancel() {
        setParams(STATE_NAME, {
            currentProcessStep: '',
            currentProcessItem: '',
            pickupLocation: '',
            sendLocation: '',
            sendLocationId: '',
            buddyNumber: ''
        });
    }


    handleModalConfirmSendBusOk() {
        this.props.form.validateFieldsAndScroll(['sendBusConfirmContact'], (errors, values) => {
            if (!errors) {
                setParams(STATE_NAME, {
                    currentProcessStep: 'sendBus',
                    showSendBusConfirm: false
                });
            }
        });
    }

    handleModalConfirmSendBusCancel(e) {
        if (e.target.tagName === 'BUTTON') {
            this.props.form.validateFieldsAndScroll(['sendBusConfirmContact'], (errors, values) => {
                if (!errors) {
                    replyFeedback({
                        UserID: this.props.userId,
                        ReplyInfo: [{
                            Content: this.props.sendBusConfirmContact.value,
                            MsgFlowID: this.props.currentProcessItem.MsgFlowID,
                            // Type: this.props.currentProcessItem.Type,
                            Type: Mapping_NeedTodoType.needTodoTypeMapperToCallType[this.props.currentProcessItem.Type],
                            UserStatus: this.props.currentProcessItem.Status
                        }]
                    });
                }
            });
        } else {
            setParams(STATE_NAME, {
                showSendBusConfirm: false
            });
        }
    }

    handleModalKAAnswerOk() {
        this.props.form.validateFieldsAndScroll(['answerKAContent'], (errors, values) => {

            if (!errors) {
                answerKA({
                    BrokerID: this.props.brokerId,
                    MsgFlowID: this.props.currentProcessItem.AskID,
                    Content: this.props.answerKAContent.value
                });
            }
        });
    }

    handleModalKAAnswerCancel() {
        setParams(STATE_NAME, {
            showKAAnswer: false,
            currentProcessItem: ''
        });
    }

    handleModalSetPocketOk() {
        this.props.form.validateFieldsAndScroll(['editPocketDate', 'editPocketRecruit', 'editPocketRemark'], (errors, values) => {
            if (!errors) {
                const { brokerId, userId, editPocketDate, editPocketRecruit, editPocketRemark, editPocketUserID, router } = this.props;

                insertMemberEnrollRecord({
                  BrokerID: brokerId,
                  ExpectedDays: editPocketDate && editPocketDate.value ? editPocketDate.value.format('YYYY-MM-DD') : '',
                  RecruitTmpID: editPocketRecruit && editPocketRecruit.value ? +editPocketRecruit.value.value : '',
                  Remark: editPocketRemark && editPocketRemark.value || '',
                  SourceType: 2,
                  UserID: userId,
                  CaseStatus: 1
                });

                if (editPocketRemark && editPocketRemark.value) {
                  // 一键处理会员需求
                  patchProcessDemands({
                    BrokerID: 0,
                    EmployeeID: AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('employeeId'),
                    Content: editPocketRemark.value,
                    UserID: userId,
                    FillInFlag: router.location.query.FillInFlag == 1 ? 1 : 0
                  });
                    // replyFeedback({
                    //     UserID: editPocketUserID && editPocketUserID.value ? +editPocketUserID.value : userId,
                    //     ReplyInfo: [{
                    //         Content: editPocketRemark.value || '',
                    //         MsgFlowID: 0,
                    //         // Type: currentProcessItem.Type,
                    //         Type: 2
                    //     }]
                    // });
                }
            }
        });
    }

    handleModalSetPocketCancel() {
        setParams(STATE_NAME, {
            currentProcessStep: '',
            currentProcessItem: '',
            editPocketDate: '',
            editPocketRecruit: '',
            editPocketRemark: ''
        });
    }

    handleModalConfirmSendBusOk() {
        this.props.form.validateFieldsAndScroll(['sendBusConfirmContact'], (errors, values) => {
            if (!errors) {
                setParams(STATE_NAME, {
                    currentProcessStep: 'sendBus',
                    showSendBusConfirm: false
                });
            }
        });
    }

    handleModalConfirmSendBusCancel(e) {
        if (e.target.tagName === 'BUTTON') {
            this.props.form.validateFieldsAndScroll(['sendBusConfirmContact'], (errors, values) => {
                if (!errors) {
                    replyFeedback({
                        UserID: this.props.userId,
                        ReplyInfo: [{
                            Content: this.props.sendBusConfirmContact.value,
                            MsgFlowID: this.props.currentProcessItem.MsgFlowID,
                            // Type: this.props.currentProcessItem.Type,
                            Type: Mapping_NeedTodoType.needTodoTypeMapperToCallType[this.props.currentProcessItem.Type],
                            UserStatus: this.props.currentProcessItem.Status
                        }]
                    });
                }
            });
        } else {
            setParams(STATE_NAME, {
                showSendBusConfirm: false
            });
        }
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        let storeList = this.matchStore(this.props.sendLocation, this.props.storeList.storeList);

        const replyTitle = (
          <div>
            <h3>{this.props.currentProcessItem.PositionName}</h3>
            <h4 style={{
              fontWeight: '400',
              marginTop: '10px'
            }}>
              {QuestionTypeMap[this.props.currentProcessItem.Type]}：{this.props.currentProcessItem.Ask}
            </h4>
          </div>
        );

        return (
            <div>
                <Modal
                    title="派车"
                    okText='确认派车'
                    visible={this.props.currentProcessStep === 'sendBus'}
                    onOk={this.handleModalSendBusOk.bind(this)}
                    onCancel={this.handleModalSendBusCancel.bind(this)}>
                    <Row>
                        <Col span={24}>
                            <FormItem label="去哪儿接" labelCol={{span: 4}} wrapperCol={{span: 20}}>
                                {getFieldDecorator('pickupLocation', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '接站地点必填'
                                        }
                                    ]
                                })(<AutoCompleteSelect enableEntryValue={true} allowClear={true} optionsData={{
                                    valueKey: 'LocationID',
                                    textKey: ['LocationName'],
                                    dataArray: [{
                                        LocationID: 9999,
                                        LocationName: '需要问路'
                                    }].concat(this.props.pickupLocationList)
                                }}/>)}
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <FormItem label="往哪儿送" labelCol={{span: 4}} wrapperCol={{span: 20}}>
                                {getFieldDecorator('sendLocation', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '送达地点必选'
                                        },
                                        {
                                            validator: (rule, value, cb) => {
                                                if (value && !value.value) {
                                                    cb('送达地点必选');
                                                }
                                                cb();
                                            }
                                        }
                                    ]
                                })(<AutoCompleteSelect allowClear={true} optionsData={{
                                    valueKey: 'HubID',
                                    textKey: 'HubName',
                                    dataArray: this.props.storeList.storeList
                                }}/>)}
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <FormItem label="随行人数" labelCol={{span: 4}} wrapperCol={{span: 20}}>
                                {getFieldDecorator('buddyNumber', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '随行人数必填'
                                        },
                                        {
                                            pattern: /^[0-9]*$/,
                                            message: '随行人数必须为数字'
                                        },
                                        {
                                            validator: (rule, value, cb) => {
                                                if (parseInt(value, 10) < 0) {
                                                    cb('随行人数必须大于或等于0');
                                                }
                                                cb();
                                            }
                                        }
                                    ],
                                    initialValue: '0'
                                })(<Input type="number" placeholder="请输入随行人数（除会员自己）"/>)}
                            </FormItem>
                        </Col>
                    </Row>
                </Modal>
                <Modal
                    title={replyTitle}
                    okText='确认回复'
                    visible={this.props.showKAAnswer}
                    onOk={this.handleModalKAAnswerOk.bind(this)}
                    onCancel={this.handleModalKAAnswerCancel.bind(this)}>
                    <Row>
                        {(this.props.currentProcessItem.PicPath && this.props.currentProcessItem.PicPath.length) && (
                          <FormItem labelCol={{span: 4}} wrapperCol={{span: 20}}>
                            <div>
                              {this.props.currentProcessItem.PicPath.filter(item => !!item).map((item, index) => {
                                return (<img className="img-fluid" src={IMG_PATH + item} key={index} />);
                              })}
                            </div>
                          </FormItem>
                        )}

                        <FormItem label="回复内容" labelCol={{span: 4}} wrapperCol={{span: 20}}>
                            {getFieldDecorator('answerKAContent', {
                                rules: [
                                    {
                                        required: true,
                                        message: '回复内容必填'
                                    },
                                    {
                                        validator: function (rule, value, cb) {
                                            if (!value || !value.length || value.length < 10) {
                                                cb('回复内容不能少于10个字');
                                            }

                                            if (value.length > 140) {
                                              cb('回复内容不能超过140字');
                                            }
                                            cb();
                                        }
                                    }
                                ],
                                initialValue: ''
                            })(<TextArea rows={4} placeholder="请输入联系记录，最少10个字" style={{resize: 'none'}}/>)}
                        </FormItem>
                    </Row>
                </Modal>
                <Modal
                    title="装进口袋"
                    okText='保存'
                    visible={this.props.currentProcessStep === 'setPocket'}
                    onOk={this.handleModalSetPocketOk.bind(this)}
                    onCancel={this.handleModalSetPocketCancel.bind(this)}>
                    <Row>
                        <Col span={24}>
                            <FormItem label="报名企业" labelCol={{span: 7}} wrapperCol={{span: 17}}>
                                {getFieldDecorator('editPocketRecruit', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '报名企业必选'
                                        },
                                        {
                                            validator: (rule, value, cb) => {
                                                if (value && !value.value) {
                                                    cb('报名企业必选');
                                                }
                                                cb();
                                            }
                                        }
                                    ]
                                })(<AutoCompleteSelect allowClear={true} optionsData={{
                                    valueKey: 'RecruitTmpID',
                                    textKey: 'RecruitName',
                                    dataArray: this.props.allRecruitList.recruitFilterList
                                }}/>)}
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <FormItem label="预计入职日期" labelCol={{span: 7}} wrapperCol={{span: 17}}>
                                {getFieldDecorator('editPocketDate', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '入职日期必填'
                                        }
                                    ]
                                })(<DatePicker className="w-100" disabledDate={(current) => {
                                    return current && current.valueOf() < moment().subtract(1, 'd');
                                }}/>)}
                            </FormItem>
                        </Col>
                        <Col span={this.props.userMobileList.length >= 1 ? 24 : 0}>
                            <FormItem label="报名手机" labelCol={{span: 7}} wrapperCol={{span: 17}}>
                                {getFieldDecorator('editPocketUserID', {
                                    rules: [{
                                      required: true,
                                      message: '手机号必填'
                                    }]
                                })(<Select className="w-100" placeholder="请选择手机号">
                                    {this.props.userMobileList.map((v_v, i_i) => {
                                        return (<Option value={v_v.UserID + ''} key={i_i}>{v_v.Phone}</Option>);
                                    })}
                                </Select>)}
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <FormItem label="联系记录" labelCol={{span: 7}} wrapperCol={{span: 17}}>
                                {getFieldDecorator('editPocketRemark', {
                                    rules: []
                                })(<Input type="text" placeholder="请输入联系记录"/>)}
                            </FormItem>
                        </Col>
                    </Row>
                </Modal>
                <Modal
                    title="一键导航"
                    okText='确认派车'
                    cancelText="暂不派车"
                    visible={this.props.showSendBusConfirm}
                    onOk={this.handleModalConfirmSendBusOk.bind(this)}
                    onCancel={this.handleModalConfirmSendBusCancel.bind(this)}>
                    <Row>
                        <p className="mb-8">请电话联系，确认{this.props.userName}符合派车要求后进行派车</p>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <FormItem label="联系记录" labelCol={{span: 4}} wrapperCol={{span: 20}}>
                                {getFieldDecorator('sendBusConfirmContact', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '联系记录必填'
                                        }
                                    ]
                                })(<TextArea rows={4} placeholder="请输入联系记录" style={{resize: 'none'}}/>)}
                            </FormItem>
                        </Col>
                    </Row>
                </Modal>
            </div>
        );
    }
}

export default Form.create({
    mapPropsToFields(props) {
        return {
            normalContactContent: props.normalContactContent,
            sendLocation: props.sendLocation,
            pickupLocation: props.pickupLocation,
            closeReason: props.closeReason,
            applyConfirmContact: props.applyConfirmContact,
            sendBusConfirmContact: props.sendBusConfirmContact,
            answerKAContent: props.answerKAContent,
            editPocketRemark: props.editPocketRemark,
            editPocketUserID: props.editPocketUserID,
            editPocketDate: props.editPocketDate,
            editPocketRecruit: props.editPocketRecruit
        };
    },
    onFieldsChange(props, fields) {
        setParams(STATE_NAME, fields);
    }
})(BlockDetailProcess);
