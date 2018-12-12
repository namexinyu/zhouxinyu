import React from 'react';
import { browserHistory } from 'react-router';

import AutoCompleteSelect from 'COMPONENT/AutoCompleteSelect';

import Mapping_CallType from 'CONFIG/EnumerateLib/Mapping_CallType';
import Mapping_NeedTodoType from 'CONFIG/EnumerateLib/Mapping_NeedTodoType';

import MemberDetailService from 'SERVICE/Broker/MemberDetailService';

import setParams from 'ACTION/setParams';
import getMemberContactRecord from 'ACTION/Broker/MemberDetail/getMemberContactRecord';
import getMemberScheduleMessageList from 'ACTION/Broker/MemberDetail/getMemberScheduleMessageList';
import getMemberDemandsInfo from 'ACTION/Broker/MemberDetail/getMemberDemandsInfo';
import setFetchStatus from "ACTION/setFetchStatus";
import replyFeedback from 'ACTION/Broker/MemberDetail/replyFeedback';
import patchProcessDemands from 'ACTION/Broker/MemberDetail/patchProcessDemands';
import getMemberStatusRecord from 'ACTION/Broker/MemberDetail/getMemberStatusRecord';
import answerKA from 'ACTION/Broker/MemberDetail/answerKA';
import resetState from 'ACTION/resetState';
import AppSessionStorage from 'CONFIG/SessionStorage/AppSessionStorage';

import moment from 'moment';

import {
    Button,
    Row,
    Col,
    Modal,
    message,
    Table,
    Form,
    Input
} from 'antd';

const { TextArea } = Input;
const FormItem = Form.Item;
const { Column, ColumnGroup } = Table;


const STATE_NAME = 'state_broker_member_detail_process';

class BlockContact extends React.PureComponent {
    componentWillReceiveProps(nextProps) {
        const { userId, brokerId, normalContactContent } = this.props;

        if (nextProps.replyFeedbackFetch.status === 'success') {
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
            this.getMemberContactRecord(nextProps);
            getMemberStatusRecord({
                UserID: userId,
                brokerId: brokerId
            });
            getMemberScheduleMessageList({
                UserID: userId,
                brokerId: brokerId
            });

            // // 一键处理会员需求
            // patchProcessDemands({
            //   BrokerID: brokerId,
            //   Content: normalContactContent.value,
            //   UserID: userId
            // });
        }

        if (nextProps.replyFeedbackFetch.status === 'error') {
            setFetchStatus(STATE_NAME, 'replyFeedbackFetch', 'close');
            Modal.error({
                title: window.errorTitle.normal,
                content: nextProps.replyFeedbackFetch.response.Desc
            });
        }

        if (nextProps.patchProcessDemandsFetch.status === 'success') {
            message.success('保存联系记录成功');

            setFetchStatus(STATE_NAME, 'patchProcessDemandsFetch', 'close');
            // 重新拉取会员需求列表
            getMemberDemandsInfo({
              BrokerID: brokerId,
              UserID: this.props.userId,
              RecordIndex: 0,
              RecordSize: 900000
            });

            // 取消客户端提醒
            MemberDetailService.cancelClientPush({
                BrokerID: brokerId,
                UserID: this.props.userId,
                UserName: this.props.userName,
                Type: 0
            });

            // new demand
            setParams(STATE_NAME, {
                normalContactContent: '',
                applyConfirmContact: '',
                showApplyConfirm: false,
                showSendBusConfirm: false,
                sendBusConfirmContact: '',
                currentProcessItem: ''
            });

            this.getMemberContactRecord(nextProps);

            getMemberStatusRecord({
                UserID: this.props.userId,
                brokerId: brokerId
            });

            getMemberScheduleMessageList({
                UserID: this.props.userId,
                brokerId: brokerId
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

    componentDidMount() {
      const lastestContactRecordInfo = JSON.parse(sessionStorage.getItem('lastestContactRecordInfo'));

      if (lastestContactRecordInfo && lastestContactRecordInfo.userId === this.props.userId) {
        setParams(STATE_NAME, {
          normalContactContent: lastestContactRecordInfo.content
        });
      }
    }

    componentWillUnmount() {
      if (this.props.normalContactContent) {
        sessionStorage.setItem('lastestContactRecordInfo', JSON.stringify({
          userId: this.props.userId,
          content: this.props.normalContactContent
        }));
      }
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
    handleSaveContactNormal() {
        const { form, normalContactContent, userId, currentProcessItem, router } = this.props;
    
        if (!normalContactContent.value) return;

        form.validateFieldsAndScroll(['normalContactContent'], (errors, values) => {
            if (!errors) {
              // 一键处理会员需求
              patchProcessDemands({
                EmployeeID: AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('employeeId'),
                BrokerID: 0,
                Content: normalContactContent.value,
                UserID: userId,
                FillInFlag: router.location.query.FillInFlag == 1 ? 1 : 0
              });
                // replyFeedback({
                //     UserID: userId,
                //     ReplyInfo: [{
                //         Content: normalContactContent.value || '',
                //         MsgFlowID: currentProcessItem.MsgFlowID,
                //         Type: Mapping_NeedTodoType.needTodoTypeMapperToCallType[currentProcessItem.Type] || 1,
                //         UserStatus: currentProcessItem.Status
                //     }]
                // });
            } else {
                let errorList = errors.normalContactContent.errors || [];
                errorList.map((item, i) => {
                    message.warning(item.message);
                });
            }
        });
    }

    render() {
        const { form: { getFieldDecorator }, currentProcessItem, estimateApplyList } = this.props;

        let feedbackOperate = (currentProcessItem.Type === 2 && !estimateApplyList.length) || currentProcessItem.Type === 4 || currentProcessItem.Type === 6 || currentProcessItem.Type === 7 || currentProcessItem.Type === 8;

        return (
            <Row className="mt-14">
                <Col span={24}>
                    <Row>
                        <Col span={24}>
                            <div>
                                <FormItem className="form-item__zeromb">
                                    {getFieldDecorator('normalContactContent', {
                                        rules: [
                                        ]
                                    })(<TextArea rows={3} placeholder="请输入联系记录" style={{ resize: 'none' }} />)}
                                </FormItem>
                                {feedbackOperate && <p className="color-red">请填写联系记录</p>}
                            </div>
                        </Col>
                    </Row>
                    <Row className="mt-14">
                        <Col span={24}>
                            <div className="flex flex--y-center">
                                <FormItem label="推荐人" className="flex__item form-item__zeromb flexible-form-item">
                                    <span className="color-primary">{this.props.userInfo.InviteName || '-'}</span>
                                    <span className="ml-16">{this.props.userInfo.InvitePhone || ''}</span>
                                </FormItem>
                                <Button htmlType="button" type="primary" onClick={() => this.handleSaveContactNormal()}>保存联系记录</Button>
                            </div>
                        </Col>
                    </Row>
                </Col>
            </Row>
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
})(BlockContact);
