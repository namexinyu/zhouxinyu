import React from 'react';

import AccountManageService from 'SERVICE/Assistant/AccountManageService';
import DepartgroupManageService from 'SERVICE/Assistant/DepartgroupManageService';

import AppSessionStorage from 'CONFIG/SessionStorage/AppSessionStorage';
const employeeId = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('employeeId');

const {
  addGroup,
  updateGroup
} = DepartgroupManageService;

import {
  Button,
  Row,
  Col,
  message,
  Form,
  Input,
  Modal,
  Select
} from 'antd';

const FormItem = Form.Item;
const { Option } = Select;

class AccountModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      
    };
  }

  handleOnOk = () => {
    const {
      isEdit,
      rowRecord,
      form
    } = this.props;

    form.validateFields((errors, values) => {
      if (!errors) {
        console.log(values);
        const {
          Department,
          GroupName
        } = values;
        
        const postData = {
          BrokerGroupName: GroupName,
          BrokerDepartmentID: +Department,
          OperatorID: employeeId
        };

        if (isEdit) {
          postData.BrokerGroupID = rowRecord.BrokerGroupID;

          updateGroup(postData).then((res) => {
            if (res.Code === 0) {
              message.success('修改战队成功！');
              this.handleOnCancel();
              this.props.onOk();
            } else {
              message.error(res.Data.Desc || '修改战队出错了，请稍后重试');
            }
          }).catch((err) => {
            message.error(err.Desc || '修改战队出错了，请稍后重试');
          });
        } else {
          addGroup(postData).then((res) => {
            if (res.Code === 0) {
              message.success('新增战队成功');
              this.handleOnCancel();
              this.props.onOk();
            } else {
              message.error(res.Data.Desc || '新增战队出错了，请稍后重试');
            }
          }).catch((err) => {
            message.error(err.Desc || '新增战队出错了，请稍后重试');
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
      isEdit,
      visible,
      departments,
      rowRecord
    } = this.props;

    return (
      <Modal
        title={isEdit ? '编辑战队' : '新增战队'}
        visible={visible}
        onOk={this.handleOnOk}
        onCancel={this.handleOnCancel}
      >
        <Form>
          <Row>
            <Col>
              <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 16 }} label="所属部门">
                {getFieldDecorator('Department', {
                  initialValue: rowRecord.BrokerDepartmentID ? `${rowRecord.BrokerDepartmentID}` : '',
                  rules: [
                    {
                      required: true,
                      message: '请选择部门'
                    }
                  ]
                })(
                  <Select
                    placeholder="请选择"
                    size="default"
                  >
                    {
                      Object.keys(departments).map((key) => {
                        return (
                          <Option key={key} value={`${key}`}>{departments[key]}</Option>
                        );
                      })
                    }
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col>
              <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 16 }} label="战队名称">
                {getFieldDecorator('GroupName', {
                  initialValue: rowRecord.BrokerGroupName || '',
                  rules: [
                    {
                      required: true,
                      message: '战队名称不能为空'
                    }
                  ]
                })(
                  <Input />
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
