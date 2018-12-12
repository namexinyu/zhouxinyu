import React from 'react';
import { Input, Button, Form, Select, Modal, Spin, Radio } from 'antd';
import { inject, observer } from "mobx-react";
import { toJS } from 'mobx';
const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 15 }
};
const FormItem = Form.Item;

@observer
class AddEmployee extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roleNameList: []
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
        values.WorkNum = values.WorkNum;
        values.JobTitleList = values.JobTitleList;
        this.props.cityModelValue.EmployeeID !== '' && (values.EmployeeID = this.props.cityModelValue.EmployeeID);
        values.PlatType = 1;
        this.props.saveAddModeValue(values, this.props.form.resetFields());
      }
    });
  }

  render () {
    const { form, cityModelValue, jobList } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
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
            <FormItem
              {...formItemLayout}
              label="英文名"
            >
              {getFieldDecorator('EnName', {
                initialValue: cityModelValue.EnName,
                rules: [{
                  required: true, message: '请填写英文名!'
                }, {
                  pattern: /[a-zA-Z]+/,
                  message: '请输入英文'
                }]
              })(
                <Input maxLength="10" placeholder="请输入英文名" autoComplete="off" />
              )}
            </FormItem>
            <FormItem
              label="工号"
              {...formItemLayout}
            >
              {getFieldDecorator('WorkNum', {
                initialValue: cityModelValue.WorkNum,
                rules: [{
                  required: true, message: '请填写工号!'
                }, {
                  pattern: /\d+/,
                  message: '请输入数字'
                }]
              })(
                <Input maxLength="10" placeholder="请输入工号" autoComplete="off" />
              )}
            </FormItem>
            <FormItem
              label="姓名"
              {...formItemLayout}
            >
              {getFieldDecorator('RealName', {
                initialValue: cityModelValue.RealName,
                rules: [{
                  required: true, message: '请填写姓名!'
                }, {
                  pattern: /^([\u4e00-\u9fa5]|[a-zA-Z]){0,20}$/g,
                  message: '姓名只能输入汉字和字母'
                }]
              })(
                <Input maxLength="10" placeholder="请输入姓名" autoComplete="off" />
              )}
            </FormItem>
            <FormItem
              label="选择岗位"
              {...formItemLayout}
            >
              {getFieldDecorator('JobTitleList', {
                initialValue: toJS(cityModelValue.JobTitleList) || []
              })(
                <Select
                  placeholder="请选择岗位"
                  tokenSeparators={[',']}
                  mode="tags"
                  onChange={(value, item) => this.props.handleOnchange(value, item)}
                >
                  {jobList && jobList.map(item => <Select.Option key={item} value={item.JobTitleID}>{item.JobTitleName}</Select.Option>)}
                </Select>
              )}
            </FormItem>
            <FormItem label="角色"{...formItemLayout}>
              {getFieldDecorator('RoleID', {
                initialValue: toJS(cityModelValue.RoleID) || []
              })(
                <div>
                  {jobList && jobList.filter(item => getFieldValue('JobTitleList') && getFieldValue('JobTitleList').some(id => id === item.JobTitleID)).map((item, index) => item.RoleName + (index === getFieldValue('JobTitleList').length - 1 ? '' : '，'))}
                </div>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label='是否在职'
            >
              {getFieldDecorator('IsValid', {
                initialValue: cityModelValue.IsValid
              })(
                <Radio.Group>
                  <Radio value={1}>在职</Radio>
                  <Radio value={2}>离职</Radio>
                </Radio.Group>
              )}
            </FormItem>
          </Form>
        </Spin>
      </Modal>
    );
  }
}

export default Form.create()(AddEmployee);