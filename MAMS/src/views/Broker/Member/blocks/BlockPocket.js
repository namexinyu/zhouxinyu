import React from 'react';

import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import ActionMAMSRecruitment from 'ACTION/Common/Recruitment/ActionMAMSRecruitment';
import AutoCompleteSelect from 'COMPONENT/AutoCompleteSelect';
import patchProcessDemands from 'ACTION/Broker/MemberDetail/patchProcessDemands';
import AppSessionStorage from 'CONFIG/SessionStorage/AppSessionStorage';

import MemberDetailService from 'SERVICE/Broker/MemberDetailService';

import { trackStatusMap } from 'UTIL/constant/constant';

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
import getPersonPostInfo from 'ACTION/Broker/MemberDetail/getPersonPostInfo';
import PocketAction from 'ACTION/Broker/Pocket';
import getStoreList from 'ACTION/Common/getStoreList';
import helpMemberApply from 'ACTION/Broker/MemberDetail/helpMemberApply';
import modifyMemberApply from 'ACTION/Broker/MemberDetail/modifyMemberApply';
import getLatestEnrollRecord from 'ACTION/Broker/MemberDetail/getLatestEnrollRecord';
import getMemberEnrollRecord from 'ACTION/Broker/MemberDetail/getMemberEnrollRecord';
import replyFeedback from 'ACTION/Broker/MemberDetail/replyFeedback';
import moment from 'moment';
import { browserHistory } from 'react-router';

const {
  getLatestPocketCase,
  updatePocketCase,
  setEstimatePick,
  setPocketCase,
  updateMemberEnrollRecord
} = PocketAction;
const {
  GetMAMSRecruitFilterList
} = ActionMAMSRecruitment;
const FormItem = Form.Item;
const { Option } = Select;
const Panel = Collapse.Panel;
const { Column, ColumnGroup } = Table;

const STATE_NAME_POCKET = 'state_broker_detail_pocket';
const STATE_NAME_ENROLL = 'state_broker_member_detail_enroll_record';

class BlockPocket extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  componentWillMount () {
    GetMAMSRecruitFilterList();
    getStoreList();
  }

  getPersonPostInfo (RecruitTmpID) {
    getPersonPostInfo({
      call_type: this.props.personInfo.call_type,
      user_id: parseInt(this.props.router.params.memberId, 10),
      recruit_tmp_id: Number(RecruitTmpID)
    });
  }

  componentWillReceiveProps (nextProps) {
    const { editRemark, processInfo, impressionInfo, getLatestEnrollRecordFetch, lastestEnrollRecord, personInfo, updateMemberEnrollRecordFetch, getPersonPostInfoFetch } = nextProps;
    if (updateMemberEnrollRecordFetch.status === 'success' && this.props.updateMemberEnrollRecordFetch.status !== 'success') {
      const { CaseLevel, BirthYear, Province, Education, MaritalStatus, Wycas, WorkYearStr } = this.props.impressionInfo;
      const Remark = this.props.editRemark;
      // 口袋属性保存触发
      if (CaseLevel.value == "" && BirthYear.value == "" && Province.value == "" && Education.value == "" && MaritalStatus.value == "" && Wycas.value.length == 0 && WorkYearStr.value == "" && (Remark !== {} && Remark.value !== undefined && Remark.value !== "") && this.props.type) {
        const getBlockContactModal = this.props.getBlockContactModal;
        const getPersonPostInfo = this.getPersonPostInfo;
        Modal.confirm({
          okText: "是",
          cancelText: "否",
          maskClosable: true,
          content: '是否是有效联系记录？',
          onOk () {
            getBlockContactModal(true);
          },
          onCancel () {

          }
        });
      }

      if ((CaseLevel.value !== "" || BirthYear.value !== "" || Province.value !== "" || Education.value !== "" || MaritalStatus.value !== "" || Wycas.value.length !== 0 || WorkYearStr.value !== "") && (Remark == {} || Remark.value == undefined || Remark.value == "")) {
        if (nextProps.processInfo.patchProcessDemandsFetch.status === 'success' && (Remark !== {} && Remark.value !== undefined && Remark.value !== "")) {
          this.getPersonPostInfo(lastestEnrollRecord.RecruitTmpID);
          return;
        } else if (nextProps.processInfo.patchProcessDemandsFetch.status === 'success' && (Remark == {} || Remark.value == undefined || Remark.value == "")) {
          this.getPersonPostInfo(lastestEnrollRecord.RecruitTmpID);
        } else if (updateMemberEnrollRecordFetch.status === 'success' && (Remark == {} || Remark.value !== undefined || Remark.value !== "")) {
          this.getPersonPostInfo(lastestEnrollRecord.RecruitTmpID);
        }
      } else if ((CaseLevel.value !== "" || BirthYear.value !== "" || Province.value !== "" || Education.value !== "" || MaritalStatus.value !== "" || Wycas.value.length !== 0 || WorkYearStr.value !== "") && (Remark !== {} && Remark.value !== undefined && Remark.value !== "")) {
        this.getPersonPostInfo(lastestEnrollRecord.RecruitTmpID);
      } else if (CaseLevel.value == "" && BirthYear.value == "" && Province.value == "" && Education.value == "" && MaritalStatus.value == "" && Wycas.value.length == 0 && WorkYearStr.value == "" && (Remark == {} || Remark.value == undefined || Remark.value == "")) {
        this.getPersonPostInfo(lastestEnrollRecord.RecruitTmpID);
      }


      setFetchStatus(STATE_NAME_POCKET, 'updateMemberEnrollRecordFetch', 'close');
      message.success('更新口袋信息成功');
      setParams(STATE_NAME_POCKET, {
        editRemark: {
          value: ''
        }
      });

      // 重新拉取口袋属性信息
      getLatestEnrollRecord({
        BrokerID: this.props.brokerId,
        UserID: this.props.userId,
        CaseStatus: 1
      });
    }

    if (updateMemberEnrollRecordFetch.status === 'error' && this.props.updateMemberEnrollRecordFetch.status !== 'error') {
      setFetchStatus(STATE_NAME_POCKET, 'updateMemberEnrollRecordFetch', 'close');
      Modal.error({
        title: window.errorTitle.normal,
        content: updateMemberEnrollRecordFetch.response.Desc
      });
    }

    if (nextProps.processInfo.patchProcessDemandsFetch.status === 'success') {
      setFetchStatus('state_broker_member_detail_process', 'patchProcessDemandsFetch', 'close');

      // 取消客户端提醒
      MemberDetailService.cancelClientPush({
        BrokerID: this.props.brokerId,
        UserID: this.props.userId,
        UserName: this.props.userName,
        Type: 0
      });
    }

    if (nextProps.processInfo.patchProcessDemandsFetch.status === 'error') {
      setFetchStatus('state_broker_member_detail_process', 'patchProcessDemandsFetch', 'close');

      Modal.error({
        title: window.errorTitle.normal,
        content: nextProps.processInfo.patchProcessDemandsFetch.response.Desc
      });
    }
  }

  handleSaveCase () {
    this.props.form.validateFieldsAndScroll(['editDate', 'editRecruit', 'editStatus', 'editRemark'], (errors, values) => {
      if (!errors) {
        const { brokerId, userId, editStatus, editDate, editPocketUserID, editRecruit, editRemark, lastestEnrollRecord, router } = this.props;
        setParams("state_broker_detail_pocket", {
          type: 0
        });
        updateMemberEnrollRecord({
          BrokerID: brokerId,
          CaseStatus: editStatus && editStatus.value ? +editStatus.value : 0,
          ExpectedDays: editDate && editDate.value ? editDate.value.format('YYYY-MM-DD') : '',
          RecruitTmpID: editRecruit && editRecruit.value ? +editRecruit.value.value : 0,
          UserRecruitBasicID: lastestEnrollRecord.UserRecruitBasicID,
          Remark: editRemark && editRemark.value || ''

        });

        if (editRemark && editRemark.value) {
          // 一键处理会员需求
          patchProcessDemands({
            BrokerID: brokerId,
            EmployeeID: AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('employeeId'),
            Content: editRemark.value,
            UserID: userId,
            FillInFlag: router.location.query.FillInFlag == 1 ? 1 : 0
          });
          // replyFeedback({
          //     UserID: editPocketUserID && editPocketUserID.value ? +editPocketUserID.value : userId,
          //     ReplyInfo: [{
          //         Content: editRemark.value || '',
          //         MsgFlowID: 0,
          //         Type: 2
          //     }]
          // });
        }

      }
    });
  }

  render () {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const CaseStatus = getFieldValue('editStatus');

    return (
      <div>
        <Card title="口袋属性" bordered={false} bodyStyle={{ padding: '10px' }}>
          <Row>
            <Col span={12}>
              <FormItem label="预计入职日期" labelCol={{ span: 7 }} wrapperCol={{ span: 17 }}>
                {getFieldDecorator('editDate', {
                  rules: [
                    {
                      required: true,
                      message: '预计入职日期必填'
                    }
                  ]
                })(<DatePicker disabledDate={(current) => {
                  return current && current.valueOf() < moment().subtract(1, 'd');
                }} />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="报名企业" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                {getFieldDecorator('editRecruit', {
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
                }} />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={this.props.userMobileList.length >= 1 ? 12 : 0}>
              <FormItem label="报名手机" labelCol={{ span: 7 }} wrapperCol={{ span: 17 }}>
                {getFieldDecorator('editPocketUserID', {
                  rules: [{
                    required: true,
                    message: '手机号必填'
                  }]
                })(<Select className="w-100" placeholder="选择手机号">
                  {this.props.userMobileList.map((v_v, i_i) => {
                    return (<Option value={v_v.UserID + ''} key={i_i}>{v_v.Phone}</Option>);
                  })}
                </Select>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="追踪状态" labelCol={{ span: 7 }} wrapperCol={{ span: 17 }}>
                {getFieldDecorator('editStatus', {
                  rules: []
                })(<Select className="w-100" placeholder="请选择追踪状态">
                  {Object.keys(trackStatusMap).map((key) => {
                    return (<Option value={key} key={key}>{trackStatusMap[key]}</Option>);
                  })}
                </Select>)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <div className="color-danger" style={{ position: 'relative', top: '-6px' }}>
                <Row>
                  <Col span={7}>&nbsp;</Col>
                  <Col span={CaseStatus == 7 ? 17 : 0}>该会员会离开口袋名单</Col>
                </Row>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem label="联系记录" labelCol={{ span: 7 }} wrapperCol={{ span: 17 }}>
                {getFieldDecorator('editRemark', {
                  rules: []
                })(<Input.TextArea className="no-resize" rows={4} type="text"
                  placeholder="请输入联系记录" />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <div className="text-right"
                style={{
                  paddingTop: '60px'
                }}>
                <Button htmlType="button" type="primary" className="ml-8"
                  onClick={this.handleSaveCase.bind(this)}>保存</Button>
              </div>
            </Col>
          </Row>
        </Card>

      </div>
    );
  }
}

export default Form.create({
  mapPropsToFields (props) {
    return {
      searchKey: props.searchKey,
      editDate: props.editDate,
      editRemark: props.editRemark,
      editRecruit: props.editRecruit,
      editStatus: props.editStatus,
      editPocketUserID: props.editPocketUserID
    };
  },
  onFieldsChange (props, fields) {
    setParams(STATE_NAME_POCKET, fields);
  }
})(BlockPocket);
