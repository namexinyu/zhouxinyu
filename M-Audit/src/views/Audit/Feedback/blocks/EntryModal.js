import React from 'react';
import moment from 'moment';

import setParams from 'ACTION/setParams';
import FeedbackAction from 'ACTION/Audit/FeedbackAction';
import DepartGroupAction from 'ACTION/Common/DepartGroupAction';
import FeedbackService from 'SERVICE/Audit/FeedbackService';

const {
  getFeedbackList
} = FeedbackAction;

const {
  GetBrokerDepartList
} = DepartGroupAction;

import {
  Button,
  Row,
  Col,
  Table,
  Select,
  Form,
  Input,
  Modal,
  DatePicker,
  Cascader,
  message,
  Alert
} from 'antd';
const confirm = Modal.confirm;
const { Option } = Select;
const { Column } = Table;
const RangePicker = DatePicker.RangePicker;
const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 5 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 12 }
    }
};
const {TextArea} = Input;
class EntryModal extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
          queryParams: {}
        };
      }
    handleConfirm = () => {
        this.props.form.validateFields((err, values) => {
            if (err) return;
            let {UserMobile, UserName, FeedbackType, TypeEx, SueRemark} = values;
            let params = {};
            if (UserMobile && UserMobile.trim() !== "") {
                params.UserMobile = UserMobile;
            }
            if (UserName && UserName.trim() !== "") {
                params.UserName = UserName;
            }
            if (FeedbackType) {
                params.FeedbackType = FeedbackType * 1;
                if (FeedbackType == "4") {
                    if (TypeEx && TypeEx.trim() !== "") {
                        params.TypeEx = TypeEx;
                    }
                }
            }
            if (SueRemark && SueRemark.trim() !== "") {
                params.SueRemark = SueRemark;
            }
            FeedbackService.addFeedbackInfo(params).then((data) => {
                if (data.Code == 0) {
                    message.success("保存成功");
                    this.props.visibleModl(false);
                    this.setState({
                        queryParams: {}
                    });
                    this.props.fetchFeedbackList(this.props.feedbackListInfo.pageQueryParams);
                }
            }).catch((err) => {    
                message.error(err.Desc);
            });
        });     
    }
    handleBlurSaveInfo = () => {
        this.props.form.validateFields(["UserMobile"], (err, values) => {
            if (err) return;
            FeedbackService.getUserInfoByMobile({UserMobile: values.UserMobile}).then((data) => {
                this.props.setParams({
                    queryParams: {
                        ...this.props.queryParams,
                        ...{UserName: {value: data.Data.UserName}}
                    }
                });
                this.setState({
                    queryParams: data.Data
                });
            }).catch((err) => {
                message.error(err.Desc);
            });
        });   
    }
    render() {
        const FormItem = Form.Item;
        const { form } = this.props;
        const { getFieldDecorator } = form;
        return (
            
            <Modal
                centered
                visible={this.props.visible}
                width="70%"
                onOk={() => this.handleConfirm()}
                onCancel={() => {this.props.visibleModl(false); this.setState({queryParams: {}});}}
                >
                <Row>
                 <Form>
                     <Col span={12}>
                        <FormItem {...formItemLayout} label="会员手机号:">
                            {getFieldDecorator('UserMobile', {
                            rules: [{
                                    required: true,
                                    message: '手机号必填'
                                }, {
                                    pattern: /^1[3-9][0-9]\d{8}$/,
                                    message: '请输入正确的11位手机号码'
                                }]
                            })(<Input onBlur={() => this.handleBlurSaveInfo('RealName')} maxLength={"11"} type="text" placeholder="会员手机号" />)}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label="会员姓名:">
                            {getFieldDecorator('UserName', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入姓名'
                                        }
                                    ]
                                })(
                                <Input maxLength={"10"} type="text" placeholder="会员姓名" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label="经纪人:">
                            <div>{this.state.queryParams.BrokerID ? (`${this.state.queryParams.BrokerName}—${this.state.queryParams.BrokerMobile}  ${this.state.queryParams.DepartName}—${this.state.queryParams.GroupName}`) : ""}</div>
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label="类型:">
                            <div>
                                {getFieldDecorator('FeedbackType', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '类型必填'
                                        }
                                    ]
                                })(
                                    <Select placeholder="请选择" style={{ width: "50%" }}>
                                        <Option disabled={this.state.queryParams.BrokerID == 0 ? true : false} value={"3"}>反馈给经纪人</Option>
                                        <Option disabled={this.state.queryParams.BrokerID !== 0 ? true : false} value={"2"}>新注册找工作</Option>    
                                        <Option value={"1"}>会员投诉建议</Option>
                                        <Option value={"4"}>其他-请输入</Option>
                                    </Select>
                                )}
                            { (this.props.queryParams.FeedbackType && this.props.queryParams.FeedbackType.value == "4") && <span> 
                                {getFieldDecorator('TypeEx')(
                                    <Input style={{display: "inline", width: "45%", marginLeft: "4%"}} maxLength={"10"} type="text" placeholder="请输入类型" />
                            )}</span>
                            }
                            </div>
                            
                        </FormItem>
                    </Col>
                    <Col style={{margin: "0 0 0 -7%"}} span={20}>
                        <FormItem {...formItemLayout} label="内容描述:">
                            <div>
                                {getFieldDecorator('SueRemark', {
                                    initialValue: "",
                                     rules: [
                                        {
                                            required: true,
                                            message: '请填写内容描述'
                                        }
                                    ]
                                })(
                                    <TextArea maxLength={"200"} rows={4} />
                                )}
                                <span style={{marginLeft: "87%"}}>{this.props.queryParams.SueRemark ? this.props.queryParams.SueRemark.value.length : 0}/200</span>
                            </div>
                        </FormItem>
                    </Col>
                </Form>
                </Row>
                {/* <div style={{marginLeft: "70%"}}>
                    <Button type="primary" style={{marginRight: "5%"}} onClick={this.handleConfirm}>保存</Button>
                    <Button onClick={() => this.props.visibleModl(false)}>取消</Button>
                </div> */}
            </Modal>
        );
    }

}

// export default Form.create({})(EntryModal);
export default Form.create({
    mapPropsToFields(props) {
      const {
        UserMobile, 
        UserName, 
        FeedbackType, 
        TypeEx, 
        SueRemark
      } = props.queryParams;
  
      return {
        UserMobile, 
        UserName, 
        FeedbackType, 
        TypeEx, 
        SueRemark
      };
    },
    onFieldsChange(props, fields) {
      props.setParams({
        queryParams: Object.assign({}, props.queryParams, fields)
      });
    }
  })(EntryModal);