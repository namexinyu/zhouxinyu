import React from 'react';
import { Input, Button, Form, Radio, Select, Modal, Spin, Popconfirm, message } from 'antd';
import { inject, observer } from "mobx-react";
import { toJS } from 'mobx';
import createFormField from 'ADMIN_UTILS/createFormField';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 15 }
};

@observer
class AddUserModel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      LeaderTitleName: ''
    };
  }
  handleCancel = () => {
    this.props.hiddenAddModel();
    this.props.form.resetFields();
  }

  handleOk = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.cityModelValue.JobTitleID !== '' && (values.JobTitleID = this.props.cityModelValue.JobTitleID);
        values.PlatType = 1;
        this.props.saveAddModeValue(values, this.props.form.resetFields());
        // if (this.props.userManagerStore.view.fetchStatus === 'success') {
        //   this.props.form.resetFields();
        // }
      }
    });
  }

  handleOnchangeJoblist = () => {
    this.props.form.getFieldValue('parentNav') === this.props.form.getFieldValue('JobTitleName') ? message.error('岗位名称和上级导航名称不可相同') : '';
  }

  render () {
    const { form } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    let parentNav = form.getFieldValue('parentNav');
    const { cityModelValue, roleList, jobList, employeeList, userJobList } = this.props;
    const { LeaderTitleName } = this.state;
    return (
      <Modal
        title={this.props.cityModelName.addModelName}
        wrapClassName="vertical-center-modal"
        visible={this.props.cityModelName.addModel}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        footer={[
          <Button key="back" onClick={this.handleCancel}>取消</Button>,
          <Button key="submit" type="primary" loading={this.props.getBillListStatus} onClick={this.handleOk}>确定</Button>
        ]}
      >
        <Spin size="large" spinning={this.props.getBillListStatus}>
          <Form>
            {parentNav &&
              <Form.Item {...formItemLayout} label="上级导航">
                {getFieldDecorator('parentNav', {
                  initialValue: cityModelValue.parentResourceName || '',
                  rules: [{ required: true, message: '必填' }]
                })(<Input disabled />)}
              </Form.Item>
            }
            <FormItem
              label="选择角色"
              {...formItemLayout}
            >
              {getFieldDecorator('RoleID', {
                initialValue: cityModelValue.RoleID,
                rules: [
                  {
                    required: true, message: '请选择选择角色!'
                  }
                ]
              })(
                <Select>
                  {roleList.map(item => <Select.Option key={item.RoleID} value={item.RoleID}>{item.RoleName}</Select.Option>)}
                </Select>
              )}
            </FormItem>
            <FormItem
              label="岗位名称"
              {...formItemLayout}
            >
              {getFieldDecorator('JobTitleName', {
                initialValue: cityModelValue.JobTitleName,
                rules: [{
                  required: true, message: '请填写真实姓名!'
                }, {
                  pattern: /^[\S]+$/g,
                  message: '姓名不能输入空格'
                }]
              })(
                <Input
                  maxLength="10"
                  placeholder="请输入真实姓名"
                  autoComplete="off"
                  onBlur={this.handleOnchangeJoblist}
                />
              )}
            </FormItem>
            {/* <FormItem
              label="上级岗位"
              {...formItemLayout}
            >
              {getFieldDecorator('LeaderTitleID', {
                initialValue: cityModelValue.LeaderTitleName
              })(
                <Select
                  allowClear={true}
                  placeholder="请选择上级岗位"
                  onChange={(value, item) => this.handleOnchangeJoblist(value, item)}
                >
                  {jobList && jobList.map(item => <Select.Option key={item.JobTitleID} item={item} value={item.JobTitleID}>{item.JobTitleName}</Select.Option>)}
                </Select>
              )}
            </FormItem> */}
            <FormItem
              label="选择员工"
              {...formItemLayout}
            >
              {getFieldDecorator('EmployeeID', {
                initialValue: toJS(cityModelValue.EmployeeID) || []
              })(
                <Select
                  placeholder="请选择员工"
                  tokenSeparators={[',']}
                  mode="tags">
                  {employeeList && employeeList.map(item => <Select.Option key={item.EmployeeID} value={item.EmployeeID}>{item.EmployeeName}</Select.Option>)}
                </Select>
              )}
            </FormItem>
          </Form>
        </Spin>
      </Modal>
    );
  }
}

export default Form.create()(AddUserModel);