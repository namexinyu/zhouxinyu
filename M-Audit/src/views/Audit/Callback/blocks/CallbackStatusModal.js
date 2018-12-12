import React from 'react';

import CallbackService from 'SERVICE/Audit/CallbackService';

const {
  getThreeCardStatus,
  setCallbackEntryData,
  updateCallbackDetail
} = CallbackService;

import {
  Button,
  Row,
  Col,
  message,
  Form,
  Input,
  Modal,
  Cascader,
  Upload,
  InputNumber,
  Select
} from 'antd';

const FormItem = Form.Item;
const { Option } = Select;
const confirm = Modal.confirm;

class CallbackStatusModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  handleOnCancel = (e) => {
    this.props.form.resetFields();
    this.props.onCancel();
  }

  handleOnOk = () => {
    const {
      form,
      detailInfo,
      rowRecord
    } = this.props;

    form.validateFields((errors, values) => {
      if (!errors) {
        console.log(values);
        console.log(detailInfo);
        const {
          InterviewStatus,
          CallbackRecord = '',
          ToBroker = '',
          ToExp = ''
        } = values;

        const postData = {
          InterviewID: rowRecord.InterviewID,
          InterviewStatus: +InterviewStatus
        };

        if (CallbackRecord.trim() !== detailInfo.ServiceRemark.trim()) {
          postData.ServiceRemark = CallbackRecord;
        }

        if (ToExp.trim() !== detailInfo.ToExperience.trim()) {
          postData.ToExperience = ToExp;
        }

        if (ToBroker.trim() !== detailInfo.ToBroker.trim()) {
          postData.ToBroker = ToBroker;
        }

        updateCallbackDetail(postData).then((res) => {
          if (res.Code === 0) {
            message.success("保存成功");
            this.props.form.resetFields();
            this.props.onOk(true);
          } else {
            message.error(res.Desc || '出错了，请稍后尝试');
          }
        }).catch((err) => {
            message.error(err.Desc || '出错了，请稍后尝试');
        });
      }
    });
  }

  handleStatusSync = (record) => {
    getThreeCardStatus({
        IdCardNum: record.IdCardNum,
        EntId: record.RecruitID,
        InterviewID: record.InterviewID,
        IneterviewDate: record.IneterviewDate
    }).then((res) => {
        if (res.Data.Status) {
            setCallbackEntryData({
                InterviewID: record.InterviewID,
                InterviewStatus: 2
            }).then((resp) => {
                if (resp.Code === 0) {
                    message.success('周薪薪入职状态同步完成');
                    this.props.onOk();
                } else {
                    message.error(resp.Desc || '周薪薪入职状态同步失败，稍后再试');                        
                }
            }).catch((error) => {
                message.error(error.Desc || '周薪薪入职状态同步失败，稍后再试');
            });
        } else {
            message.error(res.Desc || '周薪薪入职状态同步失败，稍后再试');
        }
    }).catch((err) => {
        message.error(err.Desc || '周薪薪入职状态同步失败，稍后再试');
    });
}

  render() {
    const {
      form: {
        getFieldDecorator
      },
      visible,
      entType,
      rowRecord = {},
      detailInfo = {},
      interviewStatusMap,
      workCardStatusMap,
      jffInterviewStatusMap
    } = this.props;

    return (
      <Modal
        title="回访状态"
        width="60%"
        visible={visible}
        onCancel={this.handleOnCancel}
        onOk={this.handleOnOk}
      >
        <div>
          <div>
            <div>

              <div>
                <div className="flex flex--between">
                  <div className="flex">
                    <label>会员：</label>
                    <div>{rowRecord.UserName || ''}</div>
                  </div>
                  <div className="flex">
                    <label>手机号码：</label>
                    <div>{rowRecord.Mobile || ''}</div>
                  </div>
                  <div className="flex">
                    <label>企业：</label>
                    <div>{rowRecord.RecruitName || ''}</div>
                  </div>
                </div>

                <div className="flex flex--between mt-16">
                  <div className="flex">
                    <label>业务处理：</label>
                    <div>{jffInterviewStatusMap[rowRecord.JFFInterviewStatus] || ''}</div>
                  </div>
                  <div className="flex">
                    <label>业务处理说明：</label>
                    <div>{rowRecord.JFFInterviewReason || ''}</div>
                  </div>
                  <div className="flex">
                    <label>工牌：</label>
                    <div>{workCardStatusMap[rowRecord.WorkCardStatus] || ''}</div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <Form className="mt-16">
            <Row>
              <Col span={24}>
                <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} label="面试结果">
                  <div>
                    {getFieldDecorator('InterviewStatus', {
                      initialValue: detailInfo.InterviewStatus != null ? `${detailInfo.InterviewStatus}` : undefined
                    })(
                      <Select
                        placeholder="请选择"
                        size="default"
                        disabled={entType !== 0 || (detailInfo.InterviewStatus === 2 || detailInfo.InterviewStatus === 3 || detailInfo.InterviewStatus === 4)}
                        style={{
                          width: 130
                        }}
                      >
                        {
                          Object.keys(interviewStatusMap).map(key => (
                            <Option key={key} value={`${key}`}>{interviewStatusMap[key]}</Option>
                          ))
                        }
                      </Select>
                    )}

                    {entType !== 0 && rowRecord.ZXXType === 2 && detailInfo.InterviewStatus !== 2 ? (
                      <Button className="ml-10" onClick={() => this.handleStatusSync(rowRecord)}>入职状态同步</Button>
                    ) : ''}
                  </div>
                </FormItem>
              </Col>
              <Col span={24}>
                <FormItem label="回访记录" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                  {getFieldDecorator('CallbackRecord', {
                    initialValue: detailInfo.ServiceRemark,
                    rules: [
                      {
                        validator: function (rule, value, cb) {
                          if (!!value && value.length > 60) {
                              cb('内容不能多于60个字');
                          }
                          cb();
                        }
                      }
                    ]
                  })(
                    <Input.TextArea
                      autosize={{minRows: 3, maxRows: 6}}
                      style={{resize: 'none'}}
                      maxLength="60"
                      placeholder="请输入"
                    />
                  )}
                </FormItem>
              </Col>

              <Col span={24}>
                <FormItem label="投诉给用户体验官" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                  {getFieldDecorator('ToExp', {
                    initialValue: detailInfo.ToExperience,
                    rules: [
                      {
                        validator: function (rule, value, cb) {
                          if (!!value && value.length > 60) {
                              cb('内容不能多于60个字');
                          }
                          cb();
                        }
                      }
                    ]
                  })(
                    <Input.TextArea
                      autosize={{minRows: 3, maxRows: 6}}
                      style={{resize: 'none'}}
                      maxLength="60"
                      placeholder="请输入"
                    />
                  )}
                </FormItem>
              </Col>

              <Col span={24}>
                <FormItem label="反馈经纪人" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                  {getFieldDecorator('ToBroker', {
                    initialValue: detailInfo.ToBroker,
                    rules: [
                      {
                        validator: function (rule, value, cb) {
                          if (!!value && value.length > 60) {
                              cb('内容不能多于60个字');
                          }
                          cb();
                        }
                      }
                    ]
                  })(
                    <Input.TextArea
                      autosize={{minRows: 3, maxRows: 6}}
                      style={{resize: 'none'}}
                      maxLength="60"
                      placeholder="请输入"
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
          </Form>

        </div>
        
      </Modal>
    );
  }
}

export default Form.create({})(CallbackStatusModal);
