import React from 'react';
import { Input, Button, Form, Row, Col, DatePicker, Select } from 'antd';
import { inject, observer } from "mobx-react";
import createFormField from 'ADMIN_UTILS/createFormField';
import { AutoCompleteInput } from 'web-react-base-component';
import { getFormOptLayout, getFormItemLayout, getFormLayout } from 'ADMIN_UTILS/searchFormUtil';
const formItemLayout = getFormItemLayout();
const formLayout = getFormLayout();
const formOptLayout = getFormOptLayout(2);
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

@observer
class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      JobTitleName: { text: '', value: '' }
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
    this.props.handleFormReset();
  };

  _filterOption = (input, option) => {
    return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  }

  render () {
    const { form, jobTitleList } = this.props;
    const { getFieldDecorator } = form;
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <Row gutter={32} type="flex" justify="start">
            <Col {...formLayout}>
              <FormItem {...formItemLayout}
                label="岗位名称">
                <AutoCompleteInput
                  value={this.props.searchValue.JobTitleName}
                  textKey="JobTitleName"
                  valueKey="JobTitleID"
                  dataSource={jobTitleList || []}
                  onChange={this.props.saveJiguan}
                />
                {/* {getFieldDecorator('JobTitleName')(

                  <Select
                    placeholder=""
                    autoClearSearchValue={false}
                    defaultActiveFirstOption={false}
                    allowClear={true}
                    showSearch={true}
                    filterOption={this._filterOption}
                  >
                    {jobTitleList && jobTitleList.map(item => <Select.Option key={item.JobTitleID} value={item.JobTitleName}>{item.JobTitleName}</Select.Option>)}
                  </Select>
                )} */}
              </FormItem>
            </Col>
            <Col {...formLayout}>
              <FormItem {...formItemLayout}
                label="岗位状态">
                {getFieldDecorator('Status')(
                  <Select>
                    <Select.Option value={0}>全部</Select.Option>
                    <Select.Option value={1}>有人</Select.Option>
                    <Select.Option value={2}>无人</Select.Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col {...formOptLayout} className="mb-16 text-right">
              <Button onClick={this.handleFormReset}>重置</Button>
              <Button className="ml-8" type="primary" htmlType="submit">查询</Button>
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
