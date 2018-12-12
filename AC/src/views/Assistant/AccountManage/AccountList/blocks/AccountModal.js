import React from 'react';

import AccountManageService from 'SERVICE/Assistant/AccountManageService';

import AppSessionStorage from 'CONFIG/SessionStorage/AppSessionStorage';
const employeeId = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('employeeId');
let role = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('role');
const {
  newAccount,
  updateAccount
} = AccountManageService;

import {
  Button,
  Row,
  Col,
  message,
  Form,
  Input,
  Modal,
  Cascader,
  Select
} from 'antd';

const FormItem = Form.Item;
const { Option } = Select;
const confirm = Modal.confirm;

class AccountModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      role: false
    };
  }
  componentDidMount() {
    role.map((item) => {
      if (item == "BrokerManagerAssist") {
        this.setState({
          role: true
        });
      }
    });
  }
  handleOnOk = () => {
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        console.log(values);
        const {
          UserLoginName,
          UserMobile,
          UserRealName,
          UserAccountNumber,
          UserNickName,
          UserWorkMobile,
          UserWorkWechat,
          UserWorkQQ,
          UserDepartmentGroup,
          UserLevel,
          UserBrokerID,
          UserBrokerEmployeeID
        } = values;
        
        const postData = {
          LoginName: UserLoginName,
          Mobile: UserMobile,
          RealName: UserRealName,
          NickName: UserNickName,
          WorkMobile: UserWorkMobile,
          WorkWeChat: UserWorkWechat,
          WorkQQ: UserWorkQQ.map(item => `${item.QQ}`),
          BrokerDepartment: UserDepartmentGroup[0],
          BrokerGroup: UserDepartmentGroup[1] || 0,
          RankLevel: +UserLevel,
          OperatorID: employeeId
        };

        if (this.props.isEdit) {
          postData.BrokerAccount = UserAccountNumber;
          postData.BrokerID = UserBrokerID;
          postData.BrokerEmployeeID = UserBrokerEmployeeID;
          updateAccount(postData).then((res) => {
            if (res.Code === 0) {
              message.success('修改账号成功');
              this.handleOnCancel();
              this.props.onOk();
            } else {
              message.error(res.Data.Desc || '修改账号出错了，请稍后重试');
            }
          }).catch((err) => {
            message.error(err.Desc || '修改账号出错了，请稍后重试');
          });
        } else {
          newAccount(postData).then((res) => {
            if (res.Code === 0) {
              this.handleOnCancel();
              this.props.onOk();
              Modal.success({
                title: `新增账号成功，请手动创建会员表：tbBrokerUser_${(res.Data || {}).BrokerID}`,
                onOk: () => {
                  console.log('hello');
                }
              });
            } else {
              message.error(res.Data.Desc || '新增账号出错了，请稍后重试');
            }
          }).catch((err) => {
            message.error(err.Desc || '新增账号出错了，请稍后重试');
          });
        }
      }
    });
  }

  handleOnCancel = () => {
    this.props.form.resetFields();
    this.props.onCancel();
  }

  render() {
    const {
      form: {
        getFieldDecorator
      },
      visible,
      isEdit,
      RankLevelList,
      AccountForm: {
        UserLoginName,
        UserMobile,
        UserRealName,
        UserAccountNumber,
        UserNickName,
        UserWorkMobile,
        UserWorkWechat,
        UserWorkQQ,
        UserDepartmentGroup,
        UserLevel,
        UserBrokerID,
        UserBrokerEmployeeID
      },
      DGList
    } = this.props;

    getFieldDecorator('UserWorkQQ', {
      initialValue: UserWorkQQ
    });

    return (
      <Modal
        width="60%"
        title={isEdit ? '编辑账号' : '新增账号'}
        visible={visible}
        onOk={this.handleOnOk}
        onCancel={this.handleOnCancel}
      >
        <Form>
          <Row>
            <Col span={0}>
              <FormItem labelCol={{span: 0}} wrapperCol={{span: 0}}>
                {getFieldDecorator('UserBrokerID', {
                  initialValue: UserBrokerID
                })(
                  <Input type="hidden" />
                )}
              </FormItem>
            </Col>
            <Col span={0}>
              <FormItem labelCol={{span: 0}} wrapperCol={{span: 0}}>
                {getFieldDecorator('UserBrokerEmployeeID', {
                  initialValue: UserBrokerEmployeeID
                })(
                  <Input type="hidden" />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="英文名/登录名">
                {getFieldDecorator('UserLoginName', {
                  initialValue: UserLoginName,
                  rules: [
                    {
                      required: true,
                      message: '英文名/登录名不能为空'
                    }
                  ]
                })(
                  <Input maxLength="20" />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="手机号">
                {getFieldDecorator('UserMobile', {
                  initialValue: UserMobile,
                  rules: [
                    {
                      required: true,
                      message: '手机号不能为空'
                    },
                    {
                      pattern: /^1[0-9][0-9]\d{8}$/,
                      message: '请输入正确的11位手机号'
                    }
                  ]
                })(
                  <Input type="tel" maxLength="11" />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="真实姓名">
                {getFieldDecorator('UserRealName', {
                  initialValue: UserRealName,
                  rules: [
                    {
                      required: true,
                      message: '真实姓名不能为空'
                    }
                  ]
                })(
                  <Input maxLength="8" />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="工号">
                {getFieldDecorator('UserAccountNumber', {
                  initialValue: UserAccountNumber
                })(
                  <Input disabled readOnly />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="昵称">
                {getFieldDecorator('UserNickName', {
                  initialValue: UserNickName,
                  rules: [
                    {
                      required: true,
                      message: '昵称不能为空'
                    }
                  ]
                })(
                  <Input />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="工作微信">
                {getFieldDecorator('UserWorkWechat', {
                  initialValue: UserWorkWechat,
                  rules: [
                    {
                      required: true,
                      message: '工作微信不能为空'
                    }
                  ]
                })(
                  <Input />
                )}
              </FormItem>
            </Col>
            {UserWorkQQ.map((item, index) => (
              <Col span={12} key={index}>
                <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label={`工作QQ${index + 1}`}>
                  {getFieldDecorator(`UserWorkQQ[${index}].QQ`, {
                    initialValue: item.QQ,
                    rules: [
                        {
                          required: index === 0,
                          message: '工作QQ不能为空'
                        }
                      ]
                  })(
                    <Input type="number" />
                  )}
                </FormItem>
              </Col>
            ))}
            
            <Col span={12}>
              <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="部门/战队">
                {getFieldDecorator('UserDepartmentGroup', {
                  initialValue: UserDepartmentGroup,
                  rules: [
                    {
                      required: true,
                      message: '请选择部门和战队'
                    }
                  ]
                })(
                  <Cascader
                    allowClear={true}
                    placeholder="请选择"
                    options={DGList.filter(item => item.value !== -9999)}
                  >
                  </Cascader>
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="段位">
                {getFieldDecorator('UserLevel', {
                  initialValue: UserLevel,
                  rules: [
                    {
                      required: true,
                      message: '请选择段位'
                    }
                  ]
                })(
                  <Select disabled={this.state.role} size="default" placeholder="请选择">
                    {RankLevelList.map((item, i) => (
                      <Option value={`${item.RankLevel}`} key={i}>{item.RankLevelName}</Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}

export default Form.create({})(AccountModal);
