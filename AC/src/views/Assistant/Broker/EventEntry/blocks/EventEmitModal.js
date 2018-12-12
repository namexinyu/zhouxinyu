import React from 'react';
import moment from 'moment';

import EventService from 'SERVICE/Broker/EventService';

import AliyunOssUploader from "UTIL/aliyun/AliyunOssUploader";
import ossConfig from 'CONFIG/ossConfig';

import AppSessionStorage from 'CONFIG/SessionStorage/AppSessionStorage';
import AutoCompleteSelect from 'COMPONENT/AutoCompleteSelect';
const employeeId = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('employeeId');

const IMG_PATH = ossConfig.getImgPath();

import {
  Button,
  DatePicker,
  Row,
  Col,
  message,
  Form,
  Input,
  Modal,
  Icon,
  Upload,
  Radio,
  Select
} from 'antd';
const formItemLayout = {
  labelCol: {
    xs: { span: 3 },
    sm: { span: 2 }
  },
  wrapperCol: {
    xs: { span: 8 },
    sm: { span: 8 }
  }
};
const {MonthPicker} = DatePicker;
const FormItem = Form.Item;
const { Option } = Select;
const confirm = Modal.confirm;
const RadioGroup = Radio.Group;
class EventEmitModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      questionRemark: '',
      uploadImgs: [],
      DepartmentChange: 0
    };
  }

  handleOnOk = () => {
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        console.log(values);
        const {
          QuestionRemark,
          InterviewStep,
          EventSubType,
          Department,
          EventType,
          UserAccount,
          AbnormalType,
          MoneyValue,
          YearMonth,
          UserName,
          UserMobile,
          InterviewDate,
          RecruitTmpID
        } = values;

        const {
          uploadImgs
        } = this.state;
        let Remark = "";
        if (Department * 1 == 6) {
          Remark = `会员名称:${UserName}，手机号:${UserMobile},面试时间:${moment(InterviewDate).format('YYYY-MM-DD')}企业名称:${RecruitTmpID.text}会员工号:${UserAccount},异常类型:${AbnormalType == 1 ? "少发" : "未发"},金额:${MoneyValue},月份:${YearMonth.format('YYYY-MM')},问题描述:${QuestionRemark}`;
        } else {
          Remark = QuestionRemark;
        }
        EventService.getEventEntry({
          PubEmployeeID: employeeId,
          InterviewStep: +InterviewStep, 
          EventType: +EventType, 
          Department: +Department,
          QuestionRemark: Remark,
          Pictures: uploadImgs.map(item => item.rawUrl),
          UserAccount,
          AbnormalType: AbnormalType * 1,
          MoneyValue: MoneyValue * 1,
          YearMonth: YearMonth ? YearMonth.format("YYYY:DD") : "",
          UserName,
          Mobile: UserMobile,
          InterviewDate: InterviewDate ? InterviewDate.format("YYYY:DD:MM") : "",
          RecruitName: RecruitTmpID ? RecruitTmpID.text || '' : "",
          RecruitTmpID: RecruitTmpID ? +(RecruitTmpID.value || 0) : 0
        }).then((res) => {
          if (res.Code === 0) {
            if (Date.now() > new Date(moment().format('YYYY-MM-DD') + ' 21:00')) {
              Modal.warning({
                title: '提示',
                content: `小姐姐，业务客服已下班，该问题分配给${res.Data.DiplomatName}，可能明早8:00以后才能回复。如紧急请电话或微信qq群询问。`,
                onOk: () => {
                  this.handleOnCancel();
                  this.props.onOk();
                }
              });
            } else {
              message.success(`发布成功，事件处理人是${res.Data.DiplomatName}`);
              this.handleOnCancel();
              this.props.onOk();
            }
          } else {
            message.error(res.Desc || '出错了，请稍后尝试');
          }
        }).catch((err) => {
            message.error(err.Desc || '出错了，请稍后尝试');
        });
      }
    });
  }

  handleOnCancel = () => {
    this.props.form.resetFields();
    this.setState({
      questionRemark: '',
      uploadImgs: [],
      DepartmentChange: 0
    });
    this.props.onCancel();
  }

  handleReplyChange = (e) => {
    this.setState({
      questionRemark: e.target.value
    });
  }
  DepartmentChange = (value) => {
    this.setState({
     DepartmentChange: value
    });
   }
  handleUploadChange = ({ file, fileList, e}) => {

    if (fileList.length && fileList[fileList.length - 1].originFileObj) {
      if (!ossConfig.checkImage(file)) return;
      if (!this.uploader) this.uploader = new AliyunOssUploader();

      this.uploader.uploadFile(fileList[fileList.length - 1].originFileObj, (res, error) => {
        if (res) {
          this.setState({
            uploadImgs: this.state.uploadImgs.concat({
              uid: file.uid,
              name: file.name,
              status: 'done',
              customPath: IMG_PATH,
              rawUrl: res.name,
              url: IMG_PATH + res.name
            })
          });
        } else {
          message.info('图片上传失败');
        }
      }, 'web/event/emit/');
    } else {
      this.setState({
          uploadImgs: fileList
      });
    }
  }

  render() {
    const {
      form: {
        getFieldDecorator
      },
      visible
    } = this.props;

    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传</div>
      </div>
    );

    const {
      uploadImgs
    } = this.state;

    return (
      <Modal
        title="发布事件"
        visible={visible}
        width={"50%"}
        onOk={this.handleOnOk}
        onCancel={this.handleOnCancel}
      >
        <Form>
          <Row>
            <Col span={24}>
              <FormItem label="面试阶段" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                  {getFieldDecorator("InterviewStep", {
                    rules: [{required: true, message: '请选择面试阶段!'}]
                  })(
                      <RadioGroup>
                          <Radio value="1">面试前</Radio>
                          <Radio value="2">面试中</Radio>
                          <Radio value="3">面试后</Radio>
                      </RadioGroup>
                  )}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem label="事件分类" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                  {getFieldDecorator("EventType", {
                    
                  })(
                      <Select placeholder="请选择事件分类" className="w-100" allowClear={true}>
                          <Option value={"1"}>工资待遇</Option>
                          <Option value={"2"}>补贴咨询</Option>
                          <Option value={"3"}>推荐费</Option>
                          <Option value={"4"}>报名咨询</Option>
                          <Option value={"5"}>劳务协助</Option>
                          <Option value={"6"}>离职事宜</Option>
                          <Option value={"7"}>系统问题</Option>
                          <Option value={"9"}>面试状态</Option>
                          <Option value={"10"}>录用条件</Option>
                          <Option value={"11"}>体检、住宿</Option>
                          <Option value={"12"}>周薪薪</Option>
                          <Option value={"13"}>需求问题</Option>
                          <Option value={"8"}>其他</Option>
                      </Select>
                  )}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem label="处理对象" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                  {getFieldDecorator("Department", {
                    initialValue: "",
                    rules: [{ required: true, message: '请选择处理对象!' }]
                  })(
                    <Select placeholder="请选择处理对象" onChange={this.DepartmentChange} className="w-100" allowClear={true}>
                      <Option value="1">业务部门</Option>
                      <Option value="2">补贴/推荐费</Option>
                      {/* <Option value="3">体验中心</Option> */}
                      <Option value="4">回访客服</Option>
                      <Option value="5">用户体验官</Option>
                      <Option value="6">薪资组</Option>
                    </Select>
                  )}
                </FormItem>
            </Col>
            {this.state.DepartmentChange == 6 && <div>
            <Col span={10}>
              <FormItem label="会员名称" labelCol={{ span: 9 }} wrapperCol={{ span: 15 }}>
                  {getFieldDecorator("UserName", {
                    initialValue: "",
                    rules: [{ required: true, message: '请输入会员名称!' }]
                  })(
                    <Input maxLength="10" placeholder="请输入会员名称" />
                  )}
              </FormItem>
              </Col>
              <Col span={10}>
              <FormItem label="手机号" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                  {getFieldDecorator("UserMobile", {
                    rules: [
                      { required: true, message: '请输入手机号!' },
                      {
                        pattern: /^1[2-9][0-9]\d{8}$/,
                        message: '请输入正确的11位手机号'
                      }
                    ]
                  })(
                    <Input type="tel" maxLength="11" placeholder="请输入手机号码" />
                  )}
              </FormItem>
              </Col>
              <Col span={10}>
              <FormItem label="企业" labelCol={{ span: 9 }} wrapperCol={{ span: 15 }}>
                {getFieldDecorator("RecruitTmpID", {
                  initialValue: "",
                  rules: [{ required: true, message: '请选择企业!' }]
                })(
                  <AutoCompleteSelect allowClear={true} optionsData={{
                    valueKey: 'RecruitTmpID',
                    textKey: 'RecruitName',
                    dataArray: this.props.recruitFilterList
                  }}/>
                )}
                </FormItem>
                </Col>
                <Col span={10}>
                <FormItem label="面试日期" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                {getFieldDecorator("InterviewDate", {
                  initialValue: "",
                  rules: [{ required: true, message: '请选择面试日期!' }]
                })(
                  <DatePicker placeholder="请选择面试日期" />
                )}
              </FormItem>
              </Col>
              <Col span={10}>
              <FormItem label="会员工号" labelCol={{ span: 9 }} wrapperCol={{ span: 15 }}>
                {getFieldDecorator("UserAccount", {
                  initialValue: "",
                  rules: [{
                    required: true,
                    message: '请填写会员工号!'
                  },
                  {
                        pattern: /^[0-9a-zA-Z]*$/g,
                        message: '只能输入字母数字!'
                      }]
                })(
                  <Input />
                )}
                </FormItem>
                </Col>
                <Col span={10}>
                 <FormItem label="异常类型" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                {getFieldDecorator("AbnormalType", {
                  initialValue: "",
                  rules: [{ required: true, message: '请选择异常类型!' }]
                })(
                  <Select style={{width: 150}} placeholder="请选择异常类型" className="w-100" allowClear={true}>
                      <Option value="1">少发</Option>
                      <Option value="2">未发</Option>
                  </Select>
                )}
              </FormItem>
              </Col>
              <Col span={10}>
              <FormItem label="金额" labelCol={{ span: 9 }} wrapperCol={{ span: 15 }}>
                  {getFieldDecorator("MoneyValue", {
                    initialValue: "",
                    rules: [{ 
                      required: true, 
                      message: '请输入金额!' 
                    }, {
                      pattern: /^[0-9]*$/g,
                      message: '只能输入数字!'
                    }]
                  })(
                    <Input style={{width: "200px"}} />
                  )}
              </FormItem>
              </Col>
              <Col span={10}>
              <FormItem label="月份" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                  {getFieldDecorator("YearMonth", {
                    initialValue: "",
                    rules: [{ required: true, message: '请选择月份!' }]
                  })(
                    <MonthPicker placeholder="请选择月份!" />
                  )}
              </FormItem>
            </Col>
            </div>}
            <Col span={24}>
              <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} label="问题描述">
                <div>
                  {getFieldDecorator('QuestionRemark', {
                    rules: [
                      {
                        required: true,
                        message: '问题描述不能为空'
                      },
                      {
                        validator: function (rule, value, cb) {
                          if (!!value && value.length > 200) {
                              cb('问题描述不能多于200个字');
                          }
                          cb();
                        }
                      }
                    ]
                  })(
                    <Input.TextArea autosize={{minRows: 4, maxRows: 8}} maxLength="200" placeholder="请输入" onChange={this.handleReplyChange} />
                  )}
                  <span>{this.state.questionRemark.length}/200</span>
                </div>
                
              </FormItem> 
            </Col>
            <Col span={24}>
              <FormItem label="上传图片" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                  <Upload
                    accept="image/jpeg,image/png"
                    listType="picture-card"
                    name="avatar"
                    fileList={uploadImgs}
                    onChange={this.handleUploadChange}
                  >
                    {uploadImgs.length >= 3 ? null : uploadButton}
                  </Upload>
                  <span>支持上传3个截图，每个大小不得超过2M</span>
                </div>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}
export default Form.create({})(EventEmitModal);
