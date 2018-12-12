import React from 'react';
import {
  Row,
  Col,
  Form,
  Select,
  DatePicker,
  Button,
  Input,
  Table,
  Card,
  Modal,
  Upload,
  Icon,
  Alert,
  Checkbox,
  message
} from 'antd';

const { TextArea } = Input;
import BlockPersonPostMessge from '../../Member/blocks/BlockPersonPostMessge';
import BlockPersonPostModal from '../../Member/blocks/BlockPersonpostModal';
import getEstimateSign from "ACTION/Broker/TodayEstimateSign/EstimateSign";
import ActionMAMSRecruitment from 'ACTION/Common/Recruitment/ActionMAMSRecruitment';
import getStoreList from 'ACTION/Common/getStoreList';
// import getHubList from "ACTION/Broker/HubListInfo/HubListInfo";
import resetUserInforList from "ACTION/Broker/xddResetList";
import { browserHistory } from 'react-router';
import createDispatchOrder from 'ACTION/Broker/MemberDetail/createDispatchOrder';
import getPickupLocationList from 'ACTION/Broker/MemberDetail/getPickupLocationList';
import getAllRecruitData from 'ACTION/Broker/GetAllRecruitListIncludeForbid';
import AutoCompleteSelect from 'COMPONENT/AutoCompleteSelect';
import modifyMemberApply from 'ACTION/Broker/MemberDetail/modifyMemberApply';
import getRecruitBasicData from 'ACTION/Broker/BagList/RecruitBasic';
import setFetchStatus from 'ACTION/setFetchStatus';
import setParams from 'ACTION/setParams';
import PocketAction from 'ACTION/Broker/Pocket';
import getPreSignNumData from 'ACTION/Broker/TodayEstimateSign/PreSignNum';
import getDeletePreSignData from 'ACTION/Broker/DeletePreSign';
import { DataTransfer, paramTransfer } from 'UTIL/base/CommonUtils';
import { RegexRule, Constant } from 'UTIL/constant/index';
import AppSessionStorage from 'CONFIG/SessionStorage/AppSessionStorage';
import getLatestEnrollRecord from 'ACTION/Broker/MemberDetail/getLatestEnrollRecord';
import updatePreSign from 'ACTION/Broker/MemberDetail/updatePreSign';
import formatDate from 'UTIL/base/formatDate';


const STATE_NAME = 'state_today_track_estimate_sign';
import stateObjs from "VIEW/StateObjects";

const FormItem = Form.Item;
const { Option } = Select;
import moment from 'moment';

const RangePicker = DatePicker.RangePicker;
moment.locale('zh-cn');
let OrderParams = {};
const {
  GetMAMSRecruitFilterList
} = ActionMAMSRecruitment;
const {
  getLatestPocketCase,
  updatePocketCase,
  setEstimatePick,
  setPocketCase,
  updateMemberEnrollRecord,
  insertMemberEnrollRecord
} = PocketAction;
message.config({
  top: "50%",
  duration: 2,
  marginTop: "-17px"
});

const visitStatusMap = {
  0: '待确认',
  1: '已确认',
  2: '已拒绝'
};

const brokerId = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('loginId');


// 参数筛选函数
function filterObject (obj) {
  let wrapObj = {};
  if (isArray(obj) === "Object") {
    var returnObj = [];
    for (let key in obj) {
      if (isArray(obj[key]) === "Object") {
        if (key === "PreTime") {
          if (obj[key].value[0] && obj[key].value[1]) {
            let lobj1 = { Key: "PreStartDate", Value: obj[key].value[0].format('YYYY-MM-DD') };
            let lobj2 = { Key: "PreStopDate", Value: obj[key].value[1].format('YYYY-MM-DD') };
            returnObj.push(lobj1, lobj2);
          } else {
            continue;
          }

        } else if (key === "Time") {
          continue;
        } else if (key === "PreCheckinRecruitID") {
          if (!obj["PreCheckinRecruitID"].value.value) {
            continue;
          }
          returnObj.push({ Key: "PreCheckinRecruitID", Value: obj["PreCheckinRecruitID"].value.value });
        } else if (obj[key] && obj[key].value) {
          let lobj = { Key: key, Value: obj[key].value };
          returnObj.push(lobj);
        }
      } else if (key === "RecordIndex" || key === "RecordSize") {
        wrapObj[key] = obj[key];
      }
    }
    wrapObj.QueryParams = returnObj;
    wrapObj.OrderParams = OrderParams;
    return (wrapObj);
  }
  return obj;
}

// 查数据类型函数
function isArray (o) {
  return Object.prototype.toString.call(o).slice(8, -1);
}

// 获取预签到名单列表数据
function getPreSignTableData (queryParams) {
  const {
    IsSign,
    UserName,
    UserMobile,
    PreCheckinAddrID,
    PreCheckinRecruitID,
    PreTime,
    PreVisitStatus,
    RecordIndex,
    RecordSize
  } = queryParams;

  getEstimateSign({
    BrokerID: brokerId,
    CheckinStatus: +IsSign.value,
    MatchUserName: UserName.value,
    PageInfo: {
      Count: RecordSize,
      Offset: RecordIndex
    },
    PositionName: (PreCheckinRecruitID.value || {}).text,
    PreCheckinAddr: PreCheckinAddrID.value,
    PreCheckinTimeStart: PreTime.value[0].format('YYYY-MM-DD') || '',
    PreCheckinTimeEnd: PreTime.value[1].format('YYYY-MM-DD') || '',
    UserMobile: UserMobile.value,
    VisitStatus: +PreVisitStatus.value
  });
}

// 搜索列表组件
class AdvancedSearchForm extends React.Component { // 搜索部分表单

  constructor(props) {
    super(props);


  }

  componentWillMount () {

  }

  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log(err);
      let Parms = { ...this.props.QueryParams };
      for (let key in values) {
        if (key === "PreCheckinRecruitID") {
          Parms.PreCheckinRecruitID = { value: { ...values.PreCheckinRecruitID } };
          continue;
        }
        if (key === "PreTime") {
          Parms["PreTime"] = { value: values.PreTime || [null, null] };
        } else {
          Parms[key] = {};
          Parms[key].value = values[key] || "";
        }

      }
      Parms.RecordIndex = 0;
      Parms.RecordSize = this.props.QueryParams.RecordSize;
      setParams(STATE_NAME, {
        QueryParams: Object.assign({}, this.props.QueryParams, {
          RecordIndex: Parms.RecordIndex,
          RecordSize: Parms.RecordSize
        })
      });
      if (values.PreTime[0] && values.PreTime[0].format('YYYY-MM-DD') === getTime(0) && values.PreTime[1].format('YYYY-MM-DD') === getTime(0)) {
        setParams(STATE_NAME, {
          clickActive: 0
        });
      } else if (values.PreTime[0] && values.PreTime[0].format('YYYY-MM-DD') === getTime(1) && values.PreTime[1].format('YYYY-MM-DD') === getTime(1)) {
        setParams(STATE_NAME, {
          clickActive: 1
        });
      } else {
        setParams(STATE_NAME, {
          clickActive: null
        });
      }

      getPreSignTableData(this.props.QueryParams);
      getPreSignNumData();
    });
  };

  handleReset = () => {
    this.props.form.resetFields();
    setParams(STATE_NAME, {
      clickActive: null
    });
    resetUserInforList(STATE_NAME);
  };

  // To generate mock Form.Item
  getFields () {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Row>
          <Col span={8}>
            <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="会员姓名">
              {getFieldDecorator('UserName')(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="手机号码">
              {getFieldDecorator('UserMobile', {
                rules: [{
                  pattern: /^1[0-9][0-9]\d{8}$/,
                  message: '请输入正确的11位手机号'
                }]
              })(
                <Input maxLength="11" type="tel" />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="报名企业">
              {getFieldDecorator('PreCheckinRecruitID')(
                <AutoCompleteSelect
                  allowClear={true}
                  optionsData={{
                    valueKey: "RecruitTmpID",
                    textKey: "RecruitName",
                    dataArray: this.props.recruitList || []
                  }}

                />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="预签到地址">
              {getFieldDecorator('PreCheckinAddrID')(
                <Select size="default" placeholder="请选择">
                  <Option value="">请选择</Option>
                  {
                    (this.props.hubList || []).map((item, index) => {
                      return (
                        <Option key={index} value={item.HubName}>{item.HubName}</Option>
                      );
                    })
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="是否签到">
              {getFieldDecorator('IsSign')(
                <Select
                  placeholder="请选择"
                  size="default"
                >
                  <Option value="-1">请选择</Option>
                  <Option value="0">未签到</Option>
                  <Option value="1">已签到</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="预签到日期">
              {getFieldDecorator('PreTime', { initialValue: this.props.searchArr ? [moment(getTime(0), 'YYYY-MM-DD'), moment(getTime(0), 'YYYY-MM-DD')] : null })(
                <RangePicker
                  ranges={{ "今天": [moment(), moment()], "本月": [moment(), moment().endOf('month')] }}
                  format="YYYY-MM-DD"
                  style={{ width: "100%" }}
                />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="回访状态">
              {getFieldDecorator('PreVisitStatus')(
                <Select size="default" placeholder="请选择">
                  <Option value="-1">请选择</Option>
                  {
                    Object.keys(visitStatusMap).map((key) => {
                      return (
                        <Option key={key} value={key}>{visitStatusMap[key]}</Option>
                      );
                    })
                  }
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{ textAlign: 'right', paddingRight: "10px", marginBottom: "20px" }}>

            <Button type="primary" htmlType="submit">搜索</Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
              重置
                        </Button>
          </Col>
        </Row>
      </div>

    );
  }

  render () {
    return (
      <Form
        className="ant-advanced-search-form"
        onSubmit={this.handleSearch}
      >
        <Row gutter={40}>{this.getFields()}</Row>
      </Form>
    );
  }
}

const getFormProps = (props) => {
  let result = {};
  for (let key in props) {
    if (isArray(props[key]) === "Object") {
      result[key] = props[key];
    }
  }
  return result;
};
const WrappedAdvancedSearchForm = Form.create({
  mapPropsToFields (props) {
    return getFormProps(props.QueryParams);
  },
  onFieldsChange (props, fields) {
    setParams(STATE_NAME, { QueryParams: Object.assign({}, props.QueryParams, fields) });
  }
})(AdvancedSearchForm);

// 预签到代码块
class AccountSearchForm3 extends React.Component { // 编辑或新建用户时的表单

  constructor(props) {
    super(props);

  }


  componentDidMount () {
    let record = this.props.record;
    let addrID = null;
    for (let i = 0; i < this.props.hubList.length; i++) {
      if (this.props.hubList[i].HubName === record.PreCheckinAddr) {
        addrID = this.props.hubList[i].LocationID;
      }
    }
    this.props.form.setFieldsValue({
      PreCheckinRecruitID: {
        value: record && record.PreCheckinRecruitID ? record.PreCheckinRecruitID.toString() : '',
        text: record.PreCheckinRecruitName || ''
      },
      PickLocationID: {
        value: addrID || '',
        text: record.PreCheckinAddr || ''
      }
    });
  }

  componentWillReceiveProps (nextProps) {
    const { allProps: { processInfo } } = nextProps;

    if (nextProps.allProps.processInfo.modifyMemberApplyFetch.status === 'success' && !this.props.allProps.processInfo.modifyMemberApplyFetch.status !== 'success') {
      setFetchStatus('state_broker_member_detail_process', 'modifyMemberApplyFetch', 'close');
      setEstimatePick(nextProps.allProps.setPick);
    }
    if (nextProps.allProps.processInfo.modifyMemberApplyFetch.status === 'error' && !this.props.allProps.processInfo.modifyMemberApplyFetch.status !== 'error') {
      setFetchStatus('state_broker_member_detail_process', 'modifyMemberApplyFetch', 'close');
      Modal.error({
        title: window.errorTitle.normal,
        content: nextProps.allProps.processInfo.modifyMemberApplyFetch.response.Desc
      });
    }
    if (nextProps.allProps.pocketInfo.setEstimatePickFetch.status === 'success' && !this.props.allProps.pocketInfo.setEstimatePickFetch.status !== 'success') {
      setFetchStatus('state_broker_detail_pocket', 'setEstimatePickFetch', 'close');
      message.success('更新预签到成功');
      let Parms = this.props.allProps.QueryParams;

      // getEstimateSign(filterObject(Parms));
      getPreSignTableData(Parms);
      getPreSignNumData();
      this.props.close();
      this.props.closeAll();
    }
    if (nextProps.allProps.pocketInfo.setEstimatePickFetch.status === 'error' && !this.props.allProps.pocketInfo.setEstimatePickFetch.status !== 'error') {
      setFetchStatus('state_broker_detail_pocket', 'setEstimatePickFetch', 'close');
      Modal.error({
        title: window.errorTitle.normal,
        content: nextProps.allProps.pocketInfo.setEstimatePickFetch.response.Desc
      });
    }

    // 处理设预签到相关流程
    if (processInfo.updatePreSignFetch.status === 'success') {
      message.success('更新预签到成功');
      setFetchStatus('state_broker_member_detail_process', 'updatePreSignFetch', 'close');
      let Parms = this.props.allProps.QueryParams;
      getPreSignTableData(Parms);
      // getEstimateSign(filterObject(Parms));
      getPreSignNumData();
      this.props.close();
      this.props.closeAll();
    }

    if (processInfo.updatePreSignFetch.status === 'error' && this.props.allProps.processInfo.updatePreSignFetch.status !== 'error') {
      setFetchStatus('state_broker_member_detail_process', 'updatePreSignFetch', 'close');
      message.error(processInfo.updatePreSignFetch.response.Desc);
    }
  }

  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log(err);

      if (!err) {
        const {
          allProps: {
            pocketInfo
          }
        } = this.props;
        console.log(values);
        console.log(this.props);

        updatePreSign({
          BrokerID: brokerId,
          UserPreOrderID: this.props.record.UserPreOrderID,
          RecruitTmpID: +values.PreCheckinRecruitID.value,
          LocationID: values.PickLocationID ? +values.PickLocationID.value : 0,
          PreCheckinTime: values.PickDate.format('YYYY-MM-DD'),
          CheckinStatus: 0
        });

        if (Object.keys(pocketInfo.lastestEnrollRecord).length) { // 口袋属性有值
          if ((pocketInfo.lastestEnrollRecord.ExpectedDays !== values.PickDate.format('YYYY-MM-DD')) || (+pocketInfo.lastestEnrollRecord.RecruitTmpID !== +values.PreCheckinRecruitID.value)) {
            updateMemberEnrollRecord({
              BrokerID: brokerId,
              CaseStatus: 0,
              ExpectedDays: values.PickDate.format('YYYY-MM-DD'),
              RecruitTmpID: +values.PreCheckinRecruitID.value,
              UserRecruitBasicID: pocketInfo.lastestEnrollRecord.UserRecruitBasicID,
              Remark: values.Content || ''
            });
          }
        } else {
          insertMemberEnrollRecord({
            BrokerID: brokerId,
            ExpectedDays: values.PickDate.format('YYYY-MM-DD'),
            RecruitTmpID: +values.PreCheckinRecruitID.value,
            Remark: values.Content || '',
            SourceType: 2,
            UserID: values.UserID ? +values.UserID : this.props.record.UserID,
            CaseStatus: 1
          });
        }
      }

      // if (!values.PickDate || !values.PreRecruitID || !values.PickLocationID) {
      //     alert("请将信息填写完整！");
      //     return;
      // }


    });
    // this.props.form.resetFields();
    // this.props.close();
  };

  handleCancel = () => {
    this.props.close();
  };

  // To generate mock Form.Item
  getFields () {
    const { getFieldDecorator } = this.props.form;
    let record = this.props.record || '';
    const userMobileList = record.UserMobileList || [];
    return (
      <div>
        <Col span={12}>
          {userMobileList.length > 1 ? (
            <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="手机号码">
              {getFieldDecorator("UserID", { initialValue: this.props.record.UserID })(
                <Select className="w-100" placeholder="选择手机号">
                  {userMobileList.map((v_v, i_i) => {
                    return (<Option value={v_v.UserID + ''} key={i_i}>{v_v.UserMobile}</Option>);
                  })}
                </Select>
              )}
            </FormItem>
          ) : (
              <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="手机号码">
                {getFieldDecorator("Mobile", { initialValue: this.props.record.UserMobile })(
                  <Input disabled size="default" />
                )}
              </FormItem>
            )}
        </Col>
        <Col span={12}>
          <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="预签到日期">
            {getFieldDecorator('PickDate', {
              rules: [
                {
                  required: true,
                  message: '预签到日期必选'
                }],
              initialValue: this.props.record.PreCheckinDate ? moment(this.props.record.PreCheckinDate, 'YYYY-MM-DD') : null
            })(
              <DatePicker size="default" disabledDate={disabledDate} />
            )}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="预签到企业">
            {getFieldDecorator('PreCheckinRecruitID', {
              rules: [
                {
                  required: true,
                  message: '预签到企业必选'
                },
                {
                  validator: (rule, value, cb) => {
                    if (value && !value.value) {
                      cb('预签到企业必选');
                    }
                    cb();
                  }
                }
              ]
            })(<AutoCompleteSelect allowClear={true} optionsData={{
              valueKey: 'RecruitTmpID',
              textKey: 'RecruitName',
              dataArray: this.props.allProps.allRecruitList.recruitFilterList
            }} />)}
            {/* {getFieldDecorator('PreRecruitID')(
                            <AutoCompleteSelect
                                allowClear={true}
                                optionsData={{
                                    valueKey: "RecruitID",
                                    textKey: "RecruitName",
                                    dataArray: this.props.recruitList || []
                                }}

                            ></AutoCompleteSelect>
                        )} */}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="预签到地址">
            {getFieldDecorator('PickLocationID', {
              rules: [
                {
                  required: true,
                  message: '预签到地址必选'
                },
                {
                  validator: (rule, value, cb) => {
                    if (value && !value.value) {
                      cb('预签到地址必选');
                    }
                    cb();
                  }
                }
              ]
            })(<AutoCompleteSelect allowClear={true} optionsData={{
              valueKey: 'LocationID',
              textKey: 'HubName',
              dataArray: this.props.hubList
            }} />)}
          </FormItem>
        </Col>
        <Col span={24}>
          <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} label="联系记录">
            {getFieldDecorator('Content')(<TextArea autosize={{ minRows: 4, maxRows: 6 }} />)}
          </FormItem>
        </Col>
        <div style={{ position: "absolute", right: 20, bottom: -59, zIndex: 10 }}>
          <Button size="large" type="primary" htmlType="submit" style={{ marginRight: 8 }}
            loading={this.props.allProps.processInfo.modifyMemberApplyFetch.status == 'pending'}>确定</Button>
          <Button onClick={this.handleCancel} size="large">
            取消
                    </Button>
        </div>
      </div>
    );
  }

  render () {
    return (
      <Form
        className="ant-advanced-search-form"
        onSubmit={this.handleSearch}
      >
        <Row gutter={40}>{this.getFields()}</Row>
      </Form>
    );
  }
}

const WrappedAccount3 = Form.create()(AccountSearchForm3);

// 派车代码块
class AccountSearchForm2 extends React.Component { // 编辑或新建用户时的表单

  constructor(props) {
    super(props);


  }

  componentWillMount () {
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.allProps.processInfo.createDispatchOrderFetch.status === 'success') {
      setFetchStatus('state_broker_member_detail_process', 'createDispatchOrderFetch', 'close');
      message.success('派车成功');
      let Parms = nextProps.allProps.QueryParams;
      getPreSignTableData(Parms);
      // getEstimateSign(filterObject(Parms));
      this.props.form.resetFields();
      this.props.close();
      this.props.closeAll();
    }
    if (nextProps.allProps.processInfo.createDispatchOrderFetch.status === 'error') {
      setFetchStatus('state_broker_member_detail_process', 'createDispatchOrderFetch', 'close');
      Modal.error({
        title: window.errorTitle.normal,
        content: nextProps.allProps.processInfo.createDispatchOrderFetch.response.Desc + '1'
      });
    }
  }

  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let p_p = this.props.record.UserMobile;
        if (values.UserID) {
          let record = this.props.record || '';
          const userMobileList = record.UserMirrorList || [];
          let u_u = userMobileList.find((v) => v.UserID == values.UserID);
          if (u_u) p_p = u_u.UserMobile;
        }
        createDispatchOrder({
          BuddyNum: parseInt(values.BuddyNum || 0, 10),
          PickupLocate: values.PickupLocate.text,
          DestinationID: parseInt(values.DestinationID.value, 10),
          RecruitID: this.props.record.PreCheckinRecruitID || 0,
          Name: this.props.record.UserName || this.props.record.UserCallName || this.props.record.UserNickName,
          UserID: values.UserID ? values.UserID - 0 : this.props.record.UserID,
          Phone: p_p,
          UserOrderID: this.props.record.UserOrderID,
          CarryTime: this.props.record.PreCheckinDate
        });
      }
    });
  };

  handleCancel = () => {
    this.props.close();
  };

  // To generate mock Form.Item
  getFields () {
    const { getFieldDecorator } = this.props.form;
    let record = this.props.record || '';
    const userMobileList = record.UserMobileList || [];
    return (
      <div>
        <Col span={12}>
          <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="去哪儿接">
            {getFieldDecorator("PickupLocate", {
              rules: [
                {
                  required: true,
                  message: '接站地点必填'
                }
              ]
            })(
              <AutoCompleteSelect enableEntryValue={true} allowClear={true} optionsData={{
                valueKey: 'LocationID',
                textKey: ['LocationName'],
                dataArray: [{
                  LocationID: 9999,
                  LocationName: '需要问路'
                }].concat(this.props.pickupLocationList)
              }} />
            )}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="往哪儿送">
            {getFieldDecorator('DestinationID', {
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
              dataArray: this.props.hubList
            }} />)}
          </FormItem>
        </Col>
        <Col span={12}>
          {userMobileList.length > 1 ? (
            <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="手机号码">
              {getFieldDecorator("UserID", { initialValue: this.props.record.UserID })(
                <Select className="w-100" placeholder="选择手机号">
                  {userMobileList.map((v_v, i_i) => {
                    return (<Option value={v_v.UserID + ''} key={i_i}>{v_v.UserMobile}</Option>);
                  })}
                </Select>
              )}
            </FormItem>
          ) : (
              <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="手机号码">
                {getFieldDecorator("Mobile", { initialValue: this.props.record.Mobile })(
                  <Input disabled size="default" />
                )}
              </FormItem>
            )}
        </Col>
        <Col span={12}>
          <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="随行人数">
            {getFieldDecorator('BuddyNum', {
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
            })(<Input type="number" placeholder="请输入随行人数（除会员自己）" />)}
          </FormItem>
        </Col>
        <div style={{ position: "absolute", right: 20, bottom: -59, zIndex: 10 }}>
          <Button size="large" type="primary" htmlType="submit" style={{ marginRight: 8 }}>确定</Button>
          <Button onClick={this.handleCancel} size="large">
            取消
                    </Button>
        </div>
      </div>
    );
  }

  render () {
    return (
      <Form
        className="ant-advanced-search-form"
        onSubmit={this.handleSearch}
      >
        <Row gutter={40}>{this.getFields()}</Row>
      </Form>
    );
  }
}

const WrappedAccount2 = Form.create()(AccountSearchForm2);


// 顶部派车代码块
class AccountSearchForm4 extends React.Component { // 编辑或新建用户时的表单

  constructor(props) {
    super(props);


  }

  componentWillMount () {
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.allProps.processInfo.createDispatchOrderFetch.status === 'success') {
      setFetchStatus('state_broker_member_detail_process', 'createDispatchOrderFetch', 'close');
      message.success('派车成功');
      let Parms = nextProps.allProps.QueryParams;
      getPreSignTableData(Parms);
      // getEstimateSign(filterObject(Parms));
      this.props.form.resetFields();
      this.props.close();
      // this.props.closeAll();
    }

    if (nextProps.allProps.processInfo.createDispatchOrderFetch.status === 'error') {
      console.log('hello false');
      setFetchStatus('state_broker_member_detail_process', 'createDispatchOrderFetch', 'close');
      Modal.error({
        title: window.errorTitle.normal,
        content: nextProps.allProps.processInfo.createDispatchOrderFetch.response.Desc + '1'
      });
    }
  }

  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        createDispatchOrder({
          BuddyNum: parseInt(values.BuddyNum || 0, 10),
          PickupLocate: values.PickupLocate.text,
          DestinationID: parseInt(values.DestinationID.value, 10),
          RecruitID: null,
          Name: values.Name.trim() || '',
          UserID: null,
          Phone: values.Phone.trim() || '',
          UserOrderID: 0,
          CarryTime: getTime(0)
        });
        this.props.form.resetFields();
      }
    });
  };

  handleCancel = () => {
    this.props.close();
    this.props.form.resetFields();
  };

  // To generate mock Form.Item
  getFields () {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Row>
          <Col span={8}>
            <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="会员姓名">
              {getFieldDecorator('Name', {
                rules: [
                  {
                    required: true,
                    message: '会员姓名必填'
                  }
                ]
              })(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="手机号码">
              {getFieldDecorator('Phone', {
                rules: [
                  {
                    required: true,
                    message: '手机号码必填'
                  },
                  {
                    pattern: /^1[0-9][0-9]\d{8}$/,
                    message: '请输入正确的11位手机号'
                  }
                ]
              })(
                <Input maxLength="11" type="tel" />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="去哪儿接">
              {getFieldDecorator("PickupLocate", {
                rules: [
                  {
                    required: true,
                    message: '接站地点必选'
                  }
                ]
              })(
                <AutoCompleteSelect enableEntryValue={true} allowClear={true} optionsData={{
                  valueKey: 'LocationID',
                  textKey: ['LocationName'],
                  dataArray: [{
                    LocationID: 9999,
                    LocationName: '需要问路'
                  }].concat(this.props.pickupLocationList)
                }} />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="往哪儿送">
              {getFieldDecorator('DestinationID', {
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
                dataArray: this.props.hubList
              }} />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="随行人数">
              {getFieldDecorator('BuddyNum', {
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
              })(<Input type="number" placeholder="请输入随行人数（除会员自己）" />)}
            </FormItem>
          </Col>
        </Row>

        <div style={{ position: "absolute", right: 20, bottom: -59, zIndex: 10 }}>
          <Button size="large" type="primary" htmlType="submit" style={{ marginRight: 8 }}>确认</Button>
          <Button onClick={this.handleCancel} size="large">
            取消
                    </Button>
        </div>
      </div>
    );
  }

  render () {
    return (
      <Form
        className="ant-advanced-search-form"
        onSubmit={this.handleSearch}
      >
        <Row gutter={40}>{this.getFields()}</Row>
      </Form>
    );
  }
}

const WrappedAccount4 = Form.create()(AccountSearchForm4);


// TODO 页面主函数
class EstimateSignDetails extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      signMessgeModal: false,
      signPersonPostModal: false,
      current: Math.floor(this.props.QueryParams.RecordIndex / this.props.QueryParams.RecordSize) + 1
    };
    this.handleTabTable = this.handleTabTable.bind(this);
  }

  componentWillMount () {
    if (this.props.location.lastKey !== this.props.location.key && !(this.props.location.state && this.props.location.state.clickTab)) {
      // 获取会员列表
      getStoreList();
      // getHubList();
      GetMAMSRecruitFilterList();
      // getRecruitNameList();
      getRecruitBasicData();
      getPickupLocationList();
      getPreSignNumData();
      getAllRecruitData();
      OrderParams = this.props.OrderParams;
      let QueryParams = Object.assign({}, this.props.QueryParams);
      QueryParams.PreTime = { value: [moment(), moment()] };
      setParams(STATE_NAME, { QueryParams: Object.assign({}, QueryParams) });
      // if (window.location.search) {
      //     this.searchArr = window.location.search.slice(1).split("=");
      //     if (this.searchArr[0] == "from" && this.searchArr[1] == "board") {
      //         QueryParams.PreTime = { value: [moment(), moment()] };
      //         setParams(STATE_NAME, { QueryParams: Object.assign({}, QueryParams) });
      //     }
      // }

      getPreSignTableData(QueryParams);
    }

  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.personInfo.is_ok === 1) {
      this.setState({
        signPersonPostModal: true
      });
    } else if (nextProps.personInfo.is_ok === 2) {
      this.setState({
        signMessgeModal: true
      });
    }
    if (nextProps.getDeletePreSignFetch.status === 'success') {
      setFetchStatus('state_broker_delete_preSign', 'getDeletePreSignFetch', 'close');
      message.success('成功删除一条预签到信息。');

      // getEstimateSign(filterObject(this.props.QueryParams));
      getPreSignTableData(this.props.QueryParams);
      getPreSignNumData();
    }
  }

  dblClickTab (e, props) {
    setParams(STATE_NAME, {
      record: e,
      showWindow: true
    });
    // 获取会员的口袋属性数据
    console.log('dblClickTab', this.props);
    getLatestEnrollRecord({
      BrokerID: brokerId,
      UserID: +e.UserID,
      CaseStatus: 1
    });
  }

  handleTabTable (value, filter, sorter) {
    this.setState({
      current: value.current
    });
    let QueryParams = this.props.QueryParams;
    QueryParams.RecordSize = value.pageSize;
    QueryParams.RecordIndex = value.current * QueryParams.RecordSize - QueryParams.RecordSize;
    if (sorter && sorter.columnKey === 'PreCheckinDate') {
      OrderParams.Order = (sorter.order === "descend") ? 1 : 0;
      OrderParams.Key = ['PreCheckinDate'];
    } else if (sorter && sorter.columnKey === 'UpdateTime') {
      OrderParams.Order = (sorter.order === "descend") ? 1 : 0;
      OrderParams.Key = ['UpdateTime'];
    }

    setParams(STATE_NAME, {
      QueryParams: Object.assign({}, QueryParams),
      OrderParams: Object.assign({}, OrderParams)
    });

    // getEstimateSign(filterObject(QueryParams));
    getPreSignTableData(QueryParams);
  }

  filterDate (value) {
    let QueryParams = { ...this.props.QueryParams };
    QueryParams.PreTime = { value: [moment(getTime(value), 'YYYY-MM-DD'), moment(getTime(value), 'YYYY-MM-DD')] };
    setParams(STATE_NAME, {
      QueryParams: Object.assign({}, QueryParams),
      clickActive: value
    });

    // getEstimateSign(filterObject(QueryParams));
    getPreSignTableData(QueryParams);

  }

  handleCancel = () => {
    setParams('state_broker_member_person_post_info', {
      is_ok: ''
    });
    this.setState({
      signMessgeModal: false
    });
  }

  personPostModalCancel = () => {
    setParams('state_broker_member_person_post_info', {
      is_ok: ''
    });
    this.setState({
      signPersonPostModal: false
    });
  }

  render () {
    let estimateSignList = [];
    let RecordCount = this.props.RecordCount;
    // let hubList = (this.props.hub_list.HubList.Data && this.props.hub_list.HubList.Data.HubList) ? this.props.hub_list.HubList.Data.HubList : [];
    let hubList = this.props.storeList.storeList || [];
    if (RecordCount) {
      estimateSignList = this.props.UserInforList;

      // for (let i = 0; i < estimateSignList.length; i++) {
      //     for (let j = 0; j < estimateSignList[i].UserNameList.length; j++) {
      //         if (estimateSignList[i].UserNameList[j].Type == 1 && estimateSignList[i].UserNameList[j].UserName) {
      //             estimateSignList[i].UserName = estimateSignList[i].UserNameList[j].UserName;
      //             break;
      //         } else if (estimateSignList[i].UserNameList[j].Type == 2 && estimateSignList[i].UserNameList[j].UserName) {
      //             estimateSignList[i].UserName = estimateSignList[i].UserNameList[j].UserName;
      //             break;
      //         } else {
      //             estimateSignList[i].UserName = estimateSignList[i].UserNameList[j].UserName;
      //         }
      //     }
      // }
    }
    return (
      <div>
        <div className='ivy-page-title'>
          <div className="ivy-title">
            <h1>预签到名单</h1>
            <AlertWindowTow pickupLocationList={this.props.faulch.pickupLocationList} hubList={hubList}
              allProps={this.props} />
          </div>
        </div>

        <div className="container-fluid pt-24 pb-24">
          <Card bordered={false}>
            <WrappedAdvancedSearchForm searchArr={this.searchArr}

              chooseAll={this.props.chooseAll}
              recruitList={this.props.AllRecruitListData.RecordList}
              hubList={hubList} QueryParams={this.props.QueryParams} />
            <Alert style={{ margin: "10px 0" }} message={<div><a href="javascript:;" style={{
              textDecorationLine: this.props.clickActive === 0 ? "underline" : "none",
              fontWeight: this.props.clickActive === 0 ? "800" : "400"
            }} onClick={() => {
              this.filterDate(0);
            }}>今日预签到</a>：{this.props.TodayNum}个，<a href="javascript:;" style={{
              textDecorationLine: this.props.clickActive === 1 ? "underline" : "none",
              fontWeight: this.props.clickActive === 1 ? "800" : "400"
            }} onClick={() => {
              this.filterDate(1);
            }}>明日预签到</a>：{this.props.TomorrowNum}个</div>} type="info" showIcon />
            <Table
              rowKey={(record, index) => index}
              pagination={{
                total: this.props.RecordCount,
                pageSize: this.props.QueryParams.RecordSize,
                current: this.props.QueryParams.RecordIndex ? this.state.current : 1,
                showSizeChanger: true,
                showQuickJumper: true,
                pageSizeOptions: Constant.pageSizeOptions,
                showTotal: (total, range) => `第${range[0]}-${range[1]}条 共${total}条`
              }}
              loading={this.props.RecordListLoading}
              bordered dataSource={estimateSignList || []}
              columns={CreateColumns(this.props.OrderParams)}
              onRowDoubleClick={(e) => {
                if (+e.CheckinStatus === 1) {
                  message.error('已签到就不可以修改咯');
                  return false;
                }
                this.dblClickTab(e);
                return false;
              }}
              onChange={this.handleTabTable}
            />
            {this.props.showWindow ?
              <AlertWindow showWindow={this.props.showWindow} text='' allProps={this.props}
                pickupLocationList={this.props.faulch.pickupLocationList}
                record={this.props.record || {}} hubList={hubList} /> : ""}
          </Card>
        </div>
        <BlockPersonPostMessge
          messgeModal={this.state.signMessgeModal}
          handleCancel={this.handleCancel}
        />
        <BlockPersonPostModal
          personModal={this.state.signPersonPostModal}
          personPostModalCancel={this.personPostModalCancel}
          personInfo={this.props.personInfo}
        />
      </div>
    );
  }
}

// 点击进入会员详情页函数
function ClickUserName (UserID, UserName) {
  if (UserID) {
    browserHistory.push({
      pathname: '/broker/member/detail/' + UserID,
      query: {
        memberName: UserName
      }
    });
  }
}

// table的栅栏结构
function CreateColumns ({ Order, Key }) {
  return ([
    {
      title: '序号', dataIndex: 'index', width: 42,
      render: (text, record, index) => index + 1
    },
    {
      title: '会员姓名', dataIndex: 'UserName',
      render: (text, record) => {
        let name = record.UserName || '';
        return (
          <div>
            <a href="javascript:;" onClick={() => {
              ClickUserName(record.UserID, name);
            }}>{name}</a>
          </div>
        );
      }
    }, {
      title: '手机号码', dataIndex: 'UserMobile',
      render: (text, record) => {
        return DataTransfer.phone(record.UserMobile);
      }
    }, {
      title: '企业', dataIndex: 'PositionName'
    }, {
      title: '预签到地址', dataIndex: 'PreCheckinAddr'
    }, {
      title: '回访状态', dataIndex: 'VisitStatus',
      render: (text, record) => {
        return (text == null || text == -1) ? '' : visitStatusMap[text];
      }
    },
    {
      title: '回访备注', dataIndex: 'ReplyContent'
    },
    {
      title: '是否签到', dataIndex: 'CheckinStatus',
      render: (text, record) => {
        return (text == null || text == -1) ? '' : ['未签到', '已签到'][text];
      }
    },
    // {
    //     title: '是否签到', dataIndex: 'CheckinStatus', types: "status"
    // },
    {
      title: '预签到日期', dataIndex: 'PreCheckinTime',
      render: (text, record) => {
        return record.PreCheckinTime && moment(record.PreCheckinTime).isValid() ? moment(record.PreCheckinTime).format('YYYY-MM-DD') : '';
      }
    }, {
      title: '操作时间', dataIndex: 'ModifyTime',
      render: (text, record) => {
        const t_t = record.ModifyTime || record.CreateTime;
        return t_t && moment(t_t).isValid() ? moment(t_t).format('YYYY-MM-DD') : '';
      }
    },

    {
      title: '操作', dataIndex: 'deletData',
      render: (text, record) => {
        let { CheckinStatus } = record;
        return (
          <div>
            <a href="javascript:;" onClick={() => {
              confirm(record);
              return false;
            }} disabled={+CheckinStatus !== 0}>删除</a>
          </div>
        );
      }
    }].map((item) => {
      if (!item.render) {
        item.render = (text, record) => {
          let dataName = record[item.dataIndex];
          return (
            <div>
              {item.types ? stateObjs[item.dataIndex][dataName] : dataName}
            </div>
          );
        };
      }
      return item;
    }));
}

class AlertWindow extends React.PureComponent { // 弹出框组件

  constructor(props) {
    super(props);
    this.state = {
      currentList: 3
    };
    this.hideModal = this.hideModal.bind(this);
    this.hideAllAlertWindow = this.hideAllAlertWindow.bind(this);
    this.hideModalWrappedAccountTow = this.hideModalWrappedAccountTow.bind(this);
  }

  componentWillMount () {

  }

  componentWillUpdate () {
    return true;
  }

  hideModal () {
    this.setState({
      currentList: 3
    });
    setParams(STATE_NAME, {
      showWindow: false
    });
  }

  hideModalWrappedAccountTow () {
    this.setState({
      currentList: 3
    });
  }

  hideAllAlertWindow () {
    setParams(STATE_NAME, {
      showWindow: false
    });
  }

  render () {
    let name = this.props.record.UserName || this.props.record.UserCallName || this.props.record.UserNickName;
    return (
      <div>
        {<span>{this.props.text}</span>}
        <Modal
          title={this.state.currentList === 1 ? "会员报名管理" : this.state.currentList === 3 ? name + "--设预签到" : this.state.currentList === 2 ? name + '--派车' : ''}
          visible={this.props.allProps.showWindow}
          okText="确定"
          cancelText="取消"
          width="860px"
          onCancel={this.hideModal}
        >
          {this.state.currentList === 3 ?
            <div style={{ overflow: "hidden", marginBottom: "15px" }}><Button onClick={() => {
              this.setState({ currentList: 2 });
            }} style={{ float: "right" }} type="primary" ghost>派车</Button></div> : ""}
          {this.state.currentList === 1 ?
            <WrappedAccount close={this.hideModalWrappedAccountTow} allProps={this.props.allProps}
              record={this.props.record}
              closeAll={this.hideAllAlertWindow}></WrappedAccount> : this.state.currentList === 2 ?
              <WrappedAccount2 allProps={this.props.allProps}
                pickupLocationList={this.props.pickupLocationList}
                hubList={this.props.hubList} record={this.props.record}
                closeAll={this.hideAllAlertWindow}
                close={this.hideModalWrappedAccountTow}></WrappedAccount2> : this.state.currentList === 3 ?
                <WrappedAccount3 close={this.hideModal} allProps={this.props.allProps}
                  hubList={this.props.hubList} record={this.props.record}
                  closeAll={this.hideAllAlertWindow}
                  hubList2={this.props.hubList}></WrappedAccount3> : ''}

        </Modal>

      </div>
    );
  }
}

class AlertWindowTow extends React.PureComponent { // 弹出框组件

  constructor(props) {
    super(props);

    this.state = {
      visible: false
    };
    this.hideModal = this.hideModal.bind(this);
  }

  componentWillMount () {


  }

  hideModal () {
    this.setState({
      visible: false
    });
  }

  render () {
    return (
      <div style={{ float: "right", marginRight: "20px" }}>
        {<Button onClick={() => {
          this.setState({ visible: true });
        }} type="primary" ghost>派车</Button>}
        <Modal
          title="派车"
          visible={this.state.visible}
          okText="确定"
          cancelText="取消"
          width="830px"
          onCancel={this.hideModal}>
          <WrappedAccount4 allProps={this.props.allProps} pickupLocationList={this.props.pickupLocationList}
            hubList={this.props.hubList} close={this.hideModal} />
        </Modal>
      </div>
    );
  }
}


// 获取时间函数
function getTime (time) {
  let nowdate = new Date();
  nowdate.setDate(nowdate.getDate() + time);
  return nowdate.getFullYear() + "-" + changeNumStyle(+nowdate.getMonth() + 1) + "-" + changeNumStyle(nowdate.getDate());

}

// 给时间10一下前加0
function changeNumStyle (num) {
  return num <= 9 ? '0' + num : num;
}

function disabledDate (current) { // TODO这里有个权限限制
  const today = new Date();
  return current && new Date(formatDate(current)).getTime() < new Date(formatDate(today.setDate(today.getDate() + 1))).getTime();
}

function confirm (record) {
  Modal.confirm({
    title: '删除预签到',
    content: '确定要删除该条预签到？',
    cancelText: '取消',
    okText: '确认',
    maskClosable: true,
    onOk: () => {
      ModalOnOk(record);
    }
  });
}

function ModalOnOk (record) {
  getDeletePreSignData({
    BrokerID: brokerId,
    UserPreOrderID: +record.UserPreOrderID
  });
}

export default EstimateSignDetails;
