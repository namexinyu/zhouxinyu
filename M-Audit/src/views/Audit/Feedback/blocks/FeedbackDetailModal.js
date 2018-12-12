import React from 'react';

import { feedbackTypeMap } from 'UTIL/constant/index';

import FeedbackService from 'SERVICE/Audit/FeedbackService';

const {
  updateFeedbackInfo
} = FeedbackService;

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

class FeedbackDetailModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      sueremark: '',
      returnremark: ''
    };
  }

  handleOnCancel = (e) => {
    this.props.form.resetFields();
    this.setState({
      sueremark: '',
      returnremark: ''
    });
    this.props.onCancel();
  }

  handleOnOk = () => {

    const {
      form,
      detailInfo
    } = this.props;

    form.validateFields((errors, values) => {
      if (!errors) {
        console.log(values);
        const {
          SueRemark,
          ReturnRemark
        } = values;

        const postData = {
          PhoneFeedbackID: detailInfo.PhoneFeedbackID || 0
        };

        if (SueRemark) {
          postData.UpdateParams = [{
            Key: 'SueRemark',
            Value: SueRemark
          }];
        }

        if (ReturnRemark) {
          postData.UpdateParams = [{
            Key: 'ReturnRemark',
            Value: ReturnRemark
          }];
        }

        updateFeedbackInfo(postData).then((res) => {
          if (res.Code === 0) {
            message.success("保存成功");
            this.props.onOk();
          } else {
            message.error(res.Desc || '出错了，请稍后尝试');
          }
        }).catch((err) => {
            message.error(err.Desc || '出错了，请稍后尝试');
        });
      }
    });
  }

  handleTextAreaChange = (e, type) => {
    this.setState({
      [type]: e.target.value
    });
  }

  render() {
    const {
      form: {
        getFieldDecorator,
        getFieldsValue
      },
      detailInfo,
      visible
    } = this.props;

    const {
      sueremark,
      returnremark
    } = this.state;

    return (
      <Modal
        okText="保存"
        title="详情"
        width="50%"
        visible={visible}
        onCancel={this.handleOnCancel}
        onOk={this.handleOnOk}
      >
        <Form>
          <Row>
            <Col span={12}>
              <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="会员手机号">
                <div>{detailInfo.UserMobile || ''}</div>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="会员姓名">
                <div>{detailInfo.UserName || ''}</div>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="经纪人">
                <div>{detailInfo.BrokerName || ''}{`${detailInfo.BrokerMobile ? `-${detailInfo.BrokerMobile}` : ''}`}<span style={{marginLeft: 5}}>{detailInfo.DepartName || ''}{`${detailInfo.GroupName ? `-${detailInfo.GroupName}` : ''}`}</span></div>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="类型">
                <div>{detailInfo.FeedbackType === 4 ? `${feedbackTypeMap[detailInfo.FeedbackType]}-${detailInfo.TypeEx}` : feedbackTypeMap[detailInfo.FeedbackType]}</div>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="解决方案">
                <div>{detailInfo.DealRemark || ''}</div>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="解决成本">
                <div>{detailInfo.DealRemark === '' ? '' : `${parseFloat(+(detailInfo.SolveConsume || 0) / 100).toFixed(2)}元`}</div>
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem label="内容描述" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                {!detailInfo.DealRemark ? (
                  <div style={{
                    textAlign: 'right'
                  }}>
                    {getFieldDecorator('SueRemark', {
                      initialValue: detailInfo.SueRemark,
                      rules: [
                        {
                          required: true,
                          message: '内容描述不能为空'
                        },
                        {
                          validator: function (rule, value, cb) {
                            if (!!value && value.length > 200) {
                                cb('内容描述不能多于200个字');
                            }
                            cb();
                          }
                        }
                      ]
                    })(
                      <Input.TextArea
                        autosize={{minRows: 3, maxRows: 6}}
                        style={{resize: 'none'}}
                        maxLength="200"
                        placeholder="请输入"
                        onChange={(e) => this.handleTextAreaChange(e, 'sueremark')}
                      />
                    )}
                    <span>{sueremark.length}/200</span>
                  </div>
                ) : (
                  <div>{detailInfo.SueRemark || ''}</div>
                )}
                
              </FormItem>
            </Col>

            {detailInfo.DealRemark ? (
              <Col span={24}>
                <FormItem label="回访跟踪" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                  <div style={{
                    textAlign: 'right'
                  }}>
                    {getFieldDecorator('ReturnRemark', {
                      initialValue: detailInfo.ReturnRemark,
                      rules: [
                        {
                          required: true,
                          message: '回访跟踪不能为空'
                        },
                        {
                          validator: function (rule, value, cb) {
                            if (!!value && value.length > 200) {
                                cb('回访跟踪不能多于200个字');
                            }
                            cb();
                          }
                        }
                      ]
                    })(
                      <Input.TextArea
                        autosize={{minRows: 3, maxRows: 6}}
                        style={{resize: 'none'}}
                        maxLength="200"
                        placeholder="请输入"
                        onChange={(e) => this.handleTextAreaChange(e, 'returnremark')}
                      />
                    )}
                    <span>{returnremark.length}/200</span>
                  </div>
                </FormItem>
              </Col>
            ) : ''}
          </Row>
        </Form>
      </Modal>
    );
  }
}

export default Form.create({})(FeedbackDetailModal);
