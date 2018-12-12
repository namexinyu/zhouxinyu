import React from 'react';
import {browserHistory} from 'react-router';
import BlockCreateApply from './BlockCreateApply';
import BlockUpdateApply from './BlockUpdateApply';
import setParams from 'ACTION/setParams';
import openDialog from 'ACTION/Dialog/openDialog';
import Mapping_CallType from 'CONFIG/EnumerateLib/Mapping_CallType';
import Mapping_NeedTodoType from 'CONFIG/EnumerateLib/Mapping_NeedTodoType';
import getMemberContactRecord from 'ACTION/Broker/MemberDetail/getMemberContactRecord';
import getMemberScheduleMessageList from 'ACTION/Broker/MemberDetail/getMemberScheduleMessageList';
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

let cardBodyStyle = {
    height: '240px',
    overflowY: 'auto',
    overflowX: 'hidden'
};
const STATE_NAME = 'state_broker_member_detail_process';

class BlockDetailProcess extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            showSendLocation: false
        };
    }

    componentWillMount() {
        let location = browserHistory.getCurrentLocation();
        if (location.lastKey !== location.key && !(location.state && location.state.clickTab)) {
            resetState(STATE_NAME);
            // 获取联系记录
            this.getMemberContactRecord(this.props);
            this.getMemberScheduleMessageList(this.props);
            this.getMemberEstimateApplyList(this.props);
            getPickupLocationList();
            getRecruitSimpleList();
            getStoreList();
        }
    }

    shouldComponentUpdate() {
        return true;
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.modifyMemberApplyFetch.status === 'success' && this.props.modifyMemberApplyFetch.status !== 'success') {
            setFetchStatus(STATE_NAME, 'modifyMemberApplyFetch', 'close');
            message.success('修改报名信息成功');
            setParams(STATE_NAME, {
                currentProcessItem: '',
                updateContactContent: {
                    value: ''
                }
            });
            this.getMemberEstimateApplyList(nextProps);
            this.getMemberScheduleMessageList(nextProps);
            this.getMemberContactRecord(nextProps);
            this.getMemberStatusRecord(nextProps);
        }
        if (nextProps.modifyMemberApplyFetch.status === 'error' && this.props.modifyMemberApplyFetch.status !== 'error') {
            setFetchStatus(STATE_NAME, 'modifyMemberApplyFetch', 'close');
            Modal.error({
                title: window.errorTitle.normal,
                content: nextProps.modifyMemberApplyFetch.response.Desc
            });
        }
        if (nextProps.helpMemberApplyFetch.status === 'success' && this.props.helpMemberApplyFetch.status !== 'success') {
            setFetchStatus(STATE_NAME, 'helpMemberApplyFetch', 'close');
            message.success('代报名成功');
            setParams(STATE_NAME, {
                currentProcessStep: '',
                currentProcessItem: '',
                applyContactContent: {},
                applyRecruitId: '',
                applyRecruitName: {},
                applyStoreId: '',
                applyStoreName: '',
                applySignTime: {}
            });
            this.getMemberEstimateApplyList(nextProps);
            this.getMemberScheduleMessageList(nextProps);
            this.getMemberContactRecord(nextProps);
            this.getMemberStatusRecord(nextProps);
        }
        if (nextProps.helpMemberApplyFetch.status === 'error' && this.props.helpMemberApplyFetch.status !== 'error') {
            setFetchStatus(STATE_NAME, 'helpMemberApplyFetch', 'close');
            Modal.error({
                title: window.errorTitle.normal,
                content: nextProps.helpMemberApplyFetch.response.Desc
            });
        }
        if (nextProps.createMemberApplyFetch.status === 'success' && this.props.createMemberApplyFetch.status !== 'success') {
            setFetchStatus(STATE_NAME, 'createMemberApplyFetch', 'close');
            message.success('代报名成功');
            setParams(STATE_NAME, {
                currentProcessStep: '',
                currentProcessItem: '',
                applyContactContent: '',
                applyRecruitId: '',
                applyRecruitName: '',
                applyStoreId: '',
                applyStoreName: ''
            });
            this.getMemberEstimateApplyList(nextProps);
            this.getMemberScheduleMessageList(nextProps);
            this.getMemberContactRecord(nextProps);
            this.getMemberStatusRecord(nextProps);
        }
        if (nextProps.createMemberApplyFetch.status === 'error' && this.props.createMemberApplyFetch.status !== 'error') {
            setFetchStatus(STATE_NAME, 'createMemberApplyFetch', 'close');
            Modal.error({
                title: window.errorTitle.normal,
                content: nextProps.createMemberApplyFetch.response.Desc
            });
        }
        if (nextProps.createDispatchOrderFetch.status === 'success' && this.props.createDispatchOrderFetch.status !== 'success') {
            setFetchStatus(STATE_NAME, 'createDispatchOrderFetch', 'close');
            message.success('派单成功');
            setParams(STATE_NAME, {
                currentProcessStep: '',
                pickupLocation: '',
                sendLocation: '',
                sendLocationId: '',
                buddyNumber: ''
            });
            this.getMemberEstimateApplyList(nextProps);
            this.getMemberScheduleMessageList(nextProps);
            this.getMemberContactRecord(nextProps);
            this.getMemberStatusRecord(nextProps);
        }
        if (nextProps.createDispatchOrderFetch.status === 'error' && this.props.createDispatchOrderFetch.status !== 'error') {
            setFetchStatus(STATE_NAME, 'createDispatchOrderFetch', 'close');
            Modal.error({
                title: window.errorTitle.normal,
                content: nextProps.createDispatchOrderFetch.response.Desc
            });
        }
        if (nextProps.closeMemberApplyFetch.status === 'success' && this.props.closeMemberApplyFetch.status !== 'success') {
            setFetchStatus(STATE_NAME, 'closeMemberApplyFetch', 'close');
            message.success('成功结案');
            setParams(STATE_NAME, {
                closeReason: '',
                showCloseConfirm: false,
                currentProcessStep: '',
                currentEstimateApply: ''
            });
            this.getMemberEstimateApplyList(nextProps);
            this.getMemberScheduleMessageList(nextProps);
            this.getMemberContactRecord(nextProps);
            this.getMemberStatusRecord(nextProps);
        }
        if (nextProps.closeMemberApplyFetch.status === 'error' && this.props.closeMemberApplyFetch.status !== 'error') {
            setFetchStatus(STATE_NAME, 'closeMemberApplyFetch', 'close');
            Modal.error({
                title: window.errorTitle.normal,
                content: nextProps.closeMemberApplyFetch.response.Desc
            });
        }
        if (nextProps.replyFeedbackFetch.status === 'success' && this.props.replyFeedbackFetch.status !== 'success') {
            setFetchStatus(STATE_NAME, 'replyFeedbackFetch', 'close');
            message.success('保存联系记录成功');
            setParams(STATE_NAME, {
                normalContactContent: '',
                applyConfirmContact: '',
                showApplyConfirm: false,
                showSendBusConfirm: false,
                sendBusConfirmContact: '',
                currentProcessItem: ''
            });

            this.getMemberEstimateApplyList(nextProps);
            this.getMemberScheduleMessageList(nextProps);
            this.getMemberContactRecord(nextProps);
            this.getMemberStatusRecord(nextProps);
        }
        if (nextProps.replyFeedbackFetch.status === 'error' && this.props.replyFeedbackFetch.status !== 'error') {
            setFetchStatus(STATE_NAME, 'replyFeedbackFetch', 'close');
            Modal.error({
                title: window.errorTitle.normal,
                content: nextProps.replyFeedbackFetch.response.Desc
            });
        }
        if (nextProps.answerKAFetch.status === 'success' && this.props.answerKAFetch.status !== 'success') {
            setFetchStatus(STATE_NAME, 'answerKAFetch', 'close');
            message.success('回复成功');
            setParams(STATE_NAME, {
                currentProcessItem: '',
                showKAAnswer: false,
                answerKAContent: {}
            });
            this.getMemberEstimateApplyList(nextProps);
            this.getMemberScheduleMessageList(nextProps);
            this.getMemberContactRecord(nextProps);
            this.getMemberStatusRecord(nextProps);
        }
        if (nextProps.answerKAFetch.status === 'error' && this.props.answerKAFetch.status !== 'error') {
            setFetchStatus(STATE_NAME, 'answerKAFetch', 'close');
            Modal.error({
                title: window.errorTitle.normal,
                content: nextProps.answerKAFetch.response.Desc
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

    handleDoSearchContactList() {
        let st = this.props.contactStartTime;
        let et = this.props.contactEndTime;
        let now = new Date();
        if (st > et) {
            message.warning('开始时间不能大于结束时间');
            return false;
        }
        if (et >= new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0)) {
            message.warning('结束时间不能超过今天');
            return false;
        }
        this.getMemberContactRecord(this.props);
    }

    handleHelpApply() {
        if (this.props.currentEstimateApply) {
            Modal.warning({
                title: '温馨提示',
                content: '该会员已经存在报名记录，在新建报名前请结案原来的报名记录'
            });
        } else {
            setParams(STATE_NAME, {
                currentProcessStep: 'normalApply'
            });
        }
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


    handleCloseModal(item) {
        if (item === 1) {
            setParams(STATE_NAME, {
                currentProcessStep: '',
                pickupLocation: '',
                sendLocation: '',
                sendLocationId: '',
                buddyNumber: ''
            });
        }
        if (item === 2) {
            setParams(STATE_NAME, {
                showCloseConfirm: false
            });
        }
        if (item === 3) {
            setParams(STATE_NAME, {
                showApplyConfirm: false
            });
        }
        if (item === 4) {
            setParams(STATE_NAME, {
                showSendBusConfirm: false
            });
        }
    }

    handleSelectProcessItem(item) {
        if (item.MsgFlowID === this.props.currentProcessItem.MsgFlowID) {
            setParams(STATE_NAME, {
                currentProcessItem: ''
            });
        } else {
            // let mapperType = Mapping_NeedTodoType.needTodoTypeMapperToCallType[item.Type];
            switch (item.Type) {
                case 3: {
                    if (this.props.currentEstimateApply) {
                        setParams(STATE_NAME, {
                            showApplyConfirm: true,
                            currentProcessItem: item
                        });
                    } else {
                        setParams(STATE_NAME, {
                            currentProcessStep: 'processApply',
                            currentProcessItem: item
                        });
                    }
                    break;
                }
                case 1: {
                    setParams(STATE_NAME, {
                        currentProcessItem: item,
                        showSendBusConfirm: true
                    });
                    break;
                }
                case 5: {
                    setParams(STATE_NAME, {
                        currentProcessItem: item,
                        showKAAnswer: true
                    });
                    break;
                }
                default: {
                    setParams(STATE_NAME, {
                        currentProcessItem: item
                    });
                    break;
                }
            }
        }
    }

    // handleSaveStill() {
    //     if (!this.props.applyConfirmContact || this.props.applyConfirmContact.length < 5) {
    //         openDialog({
    //             id: 'applyConfirmContactError',
    //             type: 'toast',
    //             message: '请填写联系记录'
    //         });
    //         return false;
    //     }
    //     replyFeedback({
    //         UserID: this.props.userId,
    //         ReplyInfo: [{
    //             Content: this.props.applyConfirmContact,
    //             MsgFlowID: this.props.currentProcessItem.MsgFlowID,
    //             // Type: this.props.currentProcessItem.Type,
    //             Type: Mapping_NeedTodoType.needTodoTypeMapperToCallType[this.props.currentProcessItem.Type],
    //             UserStatus: this.props.currentProcessItem.Status
    //         }]
    //     });
    // }

    // handleSaveNew() {
    //     if (!this.props.applyConfirmContact || this.props.applyConfirmContact.length < 5) {
    //         openDialog({
    //             id: 'applyConfirmContactError',
    //             type: 'toast',
    //             message: '请填写联系记录'
    //         });
    //         return false;
    //     }
    //     replyFeedback({
    //         UserID: this.props.userId,
    //         ReplyInfo: [{
    //             Content: this.props.applyConfirmContact,
    //             MsgFlowID: this.props.currentProcessItem.MsgFlowID,
    //             // Type: this.props.currentProcessItem.Type,
    //             Type: Mapping_NeedTodoType.needTodoTypeMapperToCallType[this.props.currentProcessItem.Type],
    //             UserStatus: this.props.currentProcessItem.Status
    //         }]
    //     });
    //     renewMemberApply({
    //         UserID: this.props.userId,
    //         Name: this.props.userName,
    //         Phone: this.props.userPhone,
    //         GatherDepartID: this.props.currentEstimateApply.StoreID,
    //         SignTime: this.props.currentEstimateApply.EstimatedTime,
    //         UserStatus: 0,
    //         SourceKeyID: this.props.currentProcessItem ? this.props.currentProcessItem.SourceKeyID || 0 : 0
    //     });
    // }

    handleSaveContactNormal() {
        this.props.form.validateFieldsAndScroll(['normalContactContent'], (errors, values) => {
            if (!errors) {
                replyFeedback({
                    UserID: this.props.userId,
                    ReplyInfo: [{
                        Content: this.props.normalContactContent.value || '',
                        MsgFlowID: this.props.currentProcessItem.MsgFlowID,
                        // Type: this.props.currentProcessItem.Type,
                        Type: Mapping_NeedTodoType.needTodoTypeMapperToCallType[this.props.currentProcessItem.Type] || 1,
                        UserStatus: this.props.currentProcessItem.Status
                    }]
                });
            } else {
                let errorList = errors.normalContactContent.errors || [];
                errorList.map((item, i) => {
                    message.warning(item.message);
                });
            }
        });
    }

    unSendBus() {
        if (!this.props.sendBusConfirmContact || this.props.sendBusConfirmContact.length < 5) {
            openDialog({
                id: 'contactError',
                type: 'toast',
                message: '联系记录不能少于5个字'
            });
            return false;
        }
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

    sendBus() {
        if (!this.props.sendBusConfirmContact || this.props.sendBusConfirmContact.length < 5) {
            openDialog({
                id: 'sendBusConfirmContactError',
                type: 'toast',
                message: '联系记录不能少于5个字'
            });
            return false;
        }
        setParams(STATE_NAME, {
            currentProcessStep: 'sendBus',
            showSendBusConfirm: false
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

    getMemberScheduleMessageList(props) {
        getMemberScheduleMessageList({
            UserID: props.userId
        });
    }

    getMemberEstimateApplyList(props) {
        getMemberEstimateApplyList({
            UserID: props.userId
        });
    }

    getMemberStatusRecord(props) {
        getMemberStatusRecord({
            UserID: props.userId
        });
    }

    handleModalSendBusOk() {
        this.props.form.validateFieldsAndScroll(['sendLocation', 'pickupLocation', 'buddyNumber'], (errors, values) => {
            if (!errors) {
                if (this.props.currentProcessItem.Type === 1) {
                    if (this.props.sendBusConfirmContact.length < 5) {
                        message.error('联系记录不能少于5个字');
                        return false;
                    }
                    replyFeedback({
                        UserID: this.props.userId,
                        ReplyInfo: [{
                            Content: this.props.sendBusConfirmContact.value,
                            MsgFlowID: this.props.currentProcessItem.MsgFlowID,
                            Type: Mapping_NeedTodoType.needTodoTypeMapperToCallType[this.props.currentProcessItem.Type] || 1,
                            UserStatus: this.props.currentProcessItem.Status
                        }]
                    });
                }
                createDispatchOrder({
                    BuddyNum: parseInt(this.props.buddyNumber.value || 0, 10),
                    PickupLocate: this.props.pickupLocation.value.text,
                    DestinationID: parseInt(this.props.sendLocation.value.value, 10),
                    RecruitID: this.props.currentEstimateApply.RecruitID,
                    Name: this.props.userName,
                    UserID: this.props.userId,
                    Phone: this.props.userPhone,
                    UserOrderID: this.props.currentEstimateApply.UserOrderID,
                    CarryTime: ''
                });
            }
        });
    }

    handleModalSendBusCancel() {
        setParams(STATE_NAME, {
            currentProcessStep: ''
        });
    }

    handleModalCloseCaseOk() {
        this.props.form.validateFieldsAndScroll(['closeReason'], (errors, values) => {
            if (!errors) {
                closeMemberApply({
                    UserID: this.props.userId,
                    UserPreOrderID: this.props.currentEstimateApply.UserPreOrderID,
                    Reason: parseInt(this.props.closeReason.value, 10)
                });
            }
        });

    }

    handleModalCloseCaseCancel() {
        setParams(STATE_NAME, {
            showCloseConfirm: false
        });
    }

    handleModalApplyConfirmOk() {
        this.props.form.validateFieldsAndScroll(['applyConfirmContact'], (errors, values) => {
            if (!errors) {
                replyFeedback({
                    UserID: this.props.userId,
                    ReplyInfo: [{
                        Content: this.props.applyConfirmContact.value,
                        MsgFlowID: this.props.currentProcessItem.MsgFlowID,
                        // Type: this.props.currentProcessItem.Type,
                        Type: Mapping_NeedTodoType.needTodoTypeMapperToCallType[this.props.currentProcessItem.Type],
                        UserStatus: this.props.currentProcessItem.Status
                    }]
                });
                renewMemberApply({
                    UserID: this.props.userId,
                    Name: this.props.userName,
                    Phone: this.props.userPhone,
                    GatherDepartID: this.props.currentEstimateApply.StoreID,
                    SignTime: this.props.currentEstimateApply.EstimatedTime,
                    UserStatus: 0,
                    SourceKeyID: this.props.currentProcessItem ? this.props.currentProcessItem.SourceKeyID || 0 : 0
                });
            }
        });
    }

    handleModalApplyConfirmCancel(e) {
        if (e.target.tagName === 'BUTTON') {
            this.props.form.validateFieldsAndScroll(['applyConfirmContact'], (errors, values) => {
                if (!errors) {
                    replyFeedback({
                        UserID: this.props.userId,
                        ReplyInfo: [{
                            Content: this.props.applyConfirmContact.value,
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
                showApplyConfirm: false,
                currentProcessItem: ''
            });
        }
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
                    Content: '你好！有任何问题随时联系你的专属经纪人！谢谢！' + this.props.answerKAContent.value || '',
                    MsgFlowID: this.props.currentProcessItem.MsgFlowID
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

    render() {
        const {getFieldDecorator} = this.props.form;
        let contactList = this.props.contactList;
        let scheduleList = this.props.scheduleList;
        let storeList = this.matchStore(this.props.sendLocation, this.props.storeList.storeList);
        let feedbackOperate = (this.props.currentProcessItem.Type === 2 && !this.props.estimateApplyList.length) || this.props.currentProcessItem.Type === 4 || this.props.currentProcessItem.Type === 6 || this.props.currentProcessItem.Type === 7 || this.props.currentProcessItem.Type === 8;
        let applyOperate = (this.props.currentProcessItem.Type === 2 && this.props.estimateApplyList.length) || this.props.currentProcessItem.Type === 3;
        return (
            <div>
                <Row gutter={20}>
                    <Col span={12}>
                        <Card bodyStyle={{height: '250px', padding: '5px', overflowX: 'hidden', overflowY: 'auto'}}
                              title={<div><span>会员待办</span> <Tag color="red" className="float-right"
                                                                 style={{marginTop: '12px'}}>{scheduleList.length || 0}</Tag>
                              </div>}>
                            <Table rowKey={record => (record.SourceKeyID.toString() + record.MsgFlowID.toString())}
                                   dataSource={scheduleList}
                                   pagination={false}
                                   showHeader={false}>
                                <Column
                                    title="待办类型"
                                    dataIndex="Type"
                                    render={(text, record, index) => {
                                        return (
                                            Mapping_NeedTodoType.type[record.Type]
                                        );
                                    }}
                                />
                                <Column
                                    title="待办内容"
                                    dataIndex="Content"
                                    render={(text, record, index) => {
                                        return (
                                            record.Content
                                        );
                                    }}
                                />
                                <Column
                                    title="提交时间"
                                    dataIndex="Time"
                                    render={(text, record, index) => {
                                        return (
                                            new Date(record.Time).Format('yyyy-MM-dd hh:mm')
                                        );
                                    }}
                                />
                                <Column
                                    title="操作"
                                    dataIndex="Operate"
                                    render={(text, record, index) => {
                                        return (
                                            <Button htmlType="button" className="float-right"
                                                    type={this.props.currentProcessItem.MsgFlowID === record.MsgFlowID ? 'primary' : ''}
                                                    size="small" onClick={() => this.handleSelectProcessItem(record)}>
                                                {this.props.currentProcessItem.MsgFlowID === record.MsgFlowID ? '处理中' : '去处理'}
                                            </Button>
                                        );
                                    }}
                                />
                            </Table>
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card bodyStyle={{height: '250px', padding: '5px', overflowX: 'hidden', overflowY: 'auto'}}
                              title={<div><span>联系记录</span>
                                  <div className="float-right">
                                      <DatePicker allowClear={false} placeholder="开始时间" style={{width: '100px'}}
                                                  value={this.props.contactStartTime ? moment(this.props.contactStartTime.Format('yyyy-MM-dd')) : null}
                                                  onChange={(e) => this.handleInputChange(e, 'contactStartTime')}
                                                  disabledDate={function (current) {
                                                      return current && current.valueOf() > Date.now();
                                                  }}/>
                                      <DatePicker allowClear={false} placeholder="结束时间" className="ml-8"
                                                  style={{width: '100px'}}
                                                  value={this.props.contactEndTime ? moment(this.props.contactEndTime.Format('yyyy-MM-dd')) : null}
                                                  onChange={(e) => this.handleInputChange(e, 'contactEndTime')}
                                                  disabledDate={function (current) {
                                                      return current && current.valueOf() > Date.now();
                                                  }}/>
                                      <Button htmlType="button" size="small" type="primary" className="ml-8"
                                              onClick={() => this.handleDoSearchContactList()}>搜索</Button>
                                  </div>
                              </div>}>
                            <Table rowKey={(text, record, index) => index}
                                   dataSource={contactList}
                                   pagination={false}
                                   showHeader={false}>
                                <Column
                                    title="联系时间"
                                    dataIndex="Time"
                                    render={(text, record, index) => {
                                        return (new Date(record.Time).Format('yyyy-MM-dd hh:mm'));
                                    }}
                                    width={150}
                                />
                                <Column
                                    title="联系类型"
                                    dataIndex="ContactType"
                                    render={(text, record, index) => {
                                        return (
                                            Mapping_CallType[record.ContactType] || '-'
                                        );
                                    }}
                                    width={100}
                                />
                                <Column
                                    title="联系内容"
                                    dataIndex="Content"
                                />
                            </Table>
                        </Card>
                    </Col>
                </Row>
                <Row gutter={20} className="mt-8">
                    <Col span={12}>
                        <Card style={{border: applyOperate ? '1px solid #f00' : 'none'}}
                              bodyStyle={{height: '250px', padding: '5px', overflowX: 'hidden', overflowY: 'auto'}}
                              title={<div><span>预签到管理</span> <Button className="float-right" style={{marginTop: '12px'}}
                                                                     htmlType="button" size="small" type="primary"
                                                                     onClick={() => this.handleHelpApply()}>代报名</Button>
                              </div>}>
                            {this.props.currentProcessStep !== 'normalApply' && this.props.currentProcessStep !== 'processApply' && this.props.currentEstimateApply &&
                            <BlockUpdateApply {...this.props} />}
                            {(this.props.currentProcessStep === 'normalApply' || this.props.currentProcessStep === 'processApply') &&
                            <BlockCreateApply {...this.props} />}
                            {this.props.currentProcessStep !== 'normalApply' && this.props.currentProcessStep !== 'processApply' && !this.props.estimateApplyList.length &&
                            <h4 className="text-center mt-5">暂无报名记录</h4>}
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card style={{border: feedbackOperate ? '1px solid #f00' : 'none'}} title="写联系"
                              bodyStyle={{height: '250px', padding: '5px', overflowX: 'hidden', overflowY: 'auto'}}>
                            {getFieldDecorator('normalContactContent', {
                                rules: [
                                    {
                                        validator: function (rule, value, cb) {
                                            if (!value || !value.length || value.length < 5) {
                                                cb('联系内容不能少于5个字');
                                            }
                                            cb();
                                        }
                                    }
                                ]
                            })(<TextArea rows={8} placeholder="请输入联系记录，最少5个字" style={{resize: 'none'}}/>)}
                            <Button htmlType="button" type="primary" className="w-100 mt-8"
                                    onClick={() => this.handleSaveContactNormal()}>保存联系记录</Button>
                        </Card>
                    </Col>
                </Row>
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
                    title="结案"
                    okText='确认结案'
                    visible={this.props.showCloseConfirm}
                    onOk={this.handleModalCloseCaseOk.bind(this)}
                    onCancel={this.handleModalCloseCaseCancel.bind(this)}>
                    <Row>
                        <Col span={24}>
                            <FormItem label="结案原因" labelCol={{span: 4}} wrapperCol={{span: 20}}>
                                {getFieldDecorator('closeReason', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '结案原因必选'
                                        }
                                    ]
                                })(<Select placeholder="请选择结案原因" className="w-100">
                                    <Option value="1">无意愿找工作</Option>
                                    <Option value="2">一直不接电话</Option>
                                    <Option value="3">停机/空号</Option>
                                </Select>)}
                            </FormItem>
                        </Col>
                    </Row>
                </Modal>
                <Modal
                    title="报名确认"
                    okText='更新预报名'
                    cancelText="保留原来报名"
                    visible={this.props.showApplyConfirm}
                    onOk={this.handleModalApplyConfirmOk.bind(this)}
                    onCancel={this.handleModalApplyConfirmCancel.bind(this)}>
                    <Row>
                        <p className="mb-8">已存在报名信息，请电话联系确认是否报名该企业</p>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <FormItem label="联系记录" labelCol={{span: 4}} wrapperCol={{span: 20}}>
                                {getFieldDecorator('applyConfirmContact', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '联系记录必填'
                                        },
                                        {
                                            validator: function (rule, value, cb) {
                                                if (!value || !value.length || value.length < 5) {
                                                    cb('联系内容不能少于5个字');
                                                }
                                                cb();
                                            }
                                        }
                                    ]
                                })(<TextArea rows={4} placeholder="请输入联系记录，最少5个字" style={{resize: 'none'}}/>)}
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
                                        },
                                        {
                                            validator: function (rule, value, cb) {
                                                if (!value || !value.length || value.length < 5) {
                                                    cb('联系内容不能少于5个字');
                                                }
                                                cb();
                                            }
                                        }
                                    ]
                                })(<TextArea rows={4} placeholder="请输入联系记录，最少5个字" style={{resize: 'none'}}/>)}
                            </FormItem>
                        </Col>
                    </Row>
                </Modal>
                <Modal
                    title={"提问回复-" + this.props.currentProcessItem.Content}
                    okText='确认回复'
                    visible={this.props.showKAAnswer}
                    onOk={this.handleModalKAAnswerOk.bind(this)}
                    onCancel={this.handleModalKAAnswerCancel.bind(this)}>
                    <Row>
                        <FormItem label="问题" labelCol={{span: 4}} wrapperCol={{span: 20}}>
                            {this.props.currentProcessItem.Ask}
                        </FormItem>
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
                                                cb('联系内容不能少于5个字');
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
            answerKAContent: props.answerKAContent
        };
    },
    onFieldsChange(props, fields) {
        setParams(STATE_NAME, fields);
    }
})(BlockDetailProcess);
