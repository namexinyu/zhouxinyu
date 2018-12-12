import React from 'react';
import { Input, Button, Form, Row, Col, Select } from 'antd';
import { inject, observer } from "mobx-react";
import { toJS } from 'mobx';
import { AutoCompleteInput } from 'web-react-base-component';
import createFormField from 'ADMIN_UTILS/createFormField';
import { getFormOptLayout, getFormItemLayout, getFormLayout } from 'ADMIN_UTILS/searchFormUtil';
const formItemLayout = getFormItemLayout();
const formLayout = getFormLayout();
const formOptLayout = getFormOptLayout(4);
const FormItem = Form.Item;

@observer
class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      EnName: { text: '', value: '' },
      EmployeeName: { text: '', value: '' }
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.props.handleSubmit();
    });
  };

  handleFormReset = (e) => {
    this.setState({
      EnName: { text: '', value: '' },
      EmployeeName: { text: '', value: '' }
    });
    this.props.handleFormReset();
  };
  _filterOption = (input, option) => {
    return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  }
  saveJiguan = (obj) => {
    let value = obj;
    this.setState({ EnName: value });
    this.props.saveJiguan(obj);
  }

  saveEmployeeName = (obj) => {
    let value = obj;

    this.setState({ EmployeeName: value });
    this.props.saveEmployeeName(obj);
  }
  render () {
    const { form, employeeList } = this.props;
    const { getFieldDecorator } = form;
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <Row gutter={32} type="flex" justify="start">
            <Col {...formLayout}>
              <FormItem {...formItemLayout}
                label="英文名">
                <AutoCompleteInput
                  style={{padding: 0, border: 'none'}}
                  value={this.state.EnName.text}
                  textKey="EnName"
                  valueKey="EmployeeID"

                  dataSource={employeeList}
                  onChange={this.saveJiguan}
                />
                {/* {getFieldDecorator('EnName')(
                
                  // <Select
                  //   placeholder=""
                  //   allowClear={true}
                  //   showSearch={true}
                  //   filterOption={this._filterOption}
                  // >
                  //   {employeeList && employeeList.map(item => <Select.Option key={item.EmployeeID} value={item.EnName}>{item.EnName}</Select.Option>)}
                  // </Select>
                )} */}
              </FormItem>
            </Col>
            <Col {...formLayout}>
              <FormItem {...formItemLayout}
                label="姓名">
                <AutoCompleteInput
                  value={this.state.EmployeeName.text}
                  textKey="EmployeeName"
                  valueKey="EmployeeID"
                  dataSource={employeeList}
                  onChange={this.saveEmployeeName}
                />
                {/* {getFieldDecorator('Name')(
                
                  // <Select
                  //   placeholder=""
                  //   allowClear={true}
                  //   showSearch={true}
                  //   filterOption={this._filterOption}
                  // >
                  //   {employeeList && employeeList.map(item => <Select.Option key={item.EmployeeID} value={item.EmployeeName}>{item.EmployeeName}</Select.Option>)}
                  // </Select>
                )} */}
              </FormItem>
            </Col>
            <Col {...formLayout}>
              <FormItem {...formItemLayout}
                label="工号">
                {getFieldDecorator('WorkNum')(<Input autoComplete="off" placeholder="请输入工号" />)}
              </FormItem>
            </Col>
            <Col {...formLayout}>
              <FormItem {...formItemLayout}
                label="员工状态">
                {getFieldDecorator('IsValid')(
                  <Select>
                    <Select.Option value={0}>全部</Select.Option>
                    <Select.Option value={1}>在职</Select.Option>
                    <Select.Option value={2}>离职</Select.Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col {...formOptLayout} className="mb-16 text-right">
              <Button type="primary" htmlType="submit">搜索</Button>
              <Button className="ml-8" onClick={this.handleFormReset}>重置</Button>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}
export default Form.create({
  mapPropsToFields: props => createFormField(props.searchValue),
  onValuesChange: (props, changedValues, allValues) => props.onValuesChange(allValues)
})(SearchForm);
