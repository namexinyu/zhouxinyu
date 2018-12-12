import React from 'react';
import {
    Form,
    Row,
    Col,
    Button,
    Select,
    DatePicker
} from 'antd';
import setParams from "ACTION/setParams";
const Option = Select.Option;
import moment from 'moment';
import ResettlementScheme from "ACTION/Business/ResettlementScheme/index";
const FormItem = Form.Item;
const STATE_NAME = "Distribution";
class DistributionForm extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            add: "1"
        };
    }
    _filterOption = (input, option) => {
        return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    }
    check = () => {
        this.props.form.validateFields((err, fieldsValue) => {
            if (err) return;
            let params = {RecordIndex: 0, RecordSize: 10};
            setParams(STATE_NAME, {
                RecordIndex: 0,
                RecordSize: 10
            });
            if (fieldsValue.HubID) {
                params.HubID = fieldsValue.HubID;
            }
            if (fieldsValue.RecruitTmpID) {
                params.RecruitTmpID = fieldsValue.RecruitTmpID;
            }
            if (fieldsValue.LaborID) {
                params.LaborID = fieldsValue.LaborID;
            }
            if (fieldsValue.RecruitDate) {
                params.RecruitDate = fieldsValue.RecruitDate.format("YYYY-MM-DD");
            }
            if (fieldsValue.AllotType) {
                params.AllotType = fieldsValue.AllotType;
            }
            console.log(params);
            ResettlementScheme.GetAllotStatisticsList(params);
        });
    }
    handleFormReset = () =>{
        this.props.form.resetFields();
        setParams(STATE_NAME, {
            queryParams: {
              RecruitDate: {
                  value: moment()
              }
            }
        });
    }
    render() {
        const {getFieldDecorator} = this.props.form;
        const fLayout = {
            labelCol: {span: 8},
            wrapperCol: {span: 16}
        };
        return (
            <Form>
                <Row gutter={32}>
                    <Col span={5}>
                        <FormItem {...fLayout} label="企业：">
                            {getFieldDecorator("RecruitTmpID")(
                                <Select
                                    allowClear={true}
                                    filterOption={this._filterOption}
                                    showSearch={true}
                                    style={{ width: 120 }}
                                    placeholder='请选择企业'
                                    >
                                    {
                                        (this.props.common.RecruitSimpleList || []).map((item, i) => {
                                        return (
                                            <Option key={item.RecruitTmpID}
                                            value={item.RecruitTmpID}>{item.RecruitName}</Option>
                                        );
                                        })
                                    }
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={5}>
                        <FormItem {...fLayout} label="劳务公司：">
                            {getFieldDecorator("LaborID")(
                                <Select
                                    filterOption={this._filterOption}
                                    showSearch={true}
                                    allowClear={true}
                                    style={{ width: 120 }}
                                    placeholder='请选择劳务公司'
                                    >
                                    {
                                        (this.props.common.LaborSimpleList || []).map((item, i) => {
                                        return (
                                            <Option key={item.LaborID}
                                            value={item.LaborID}>{item.ShortName}</Option>
                                        );
                                        })
                                    }
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={5}>
                        <FormItem {...fLayout} label="签到日期：">
                            {getFieldDecorator("RecruitDate")(
                                  <DatePicker />  
                            )}
                        </FormItem>
                    </Col>
                    <Col span={5}>
                        <FormItem {...fLayout} label="集散门店：">
                            {getFieldDecorator("HubID")(
                                <Select
                                    filterOption={this._filterOption}
                                    showSearch={true}
                                    allowClear={true}
                                    style={{ width: 120 }}
                                    placeholder='请选择劳务公司'
                                    >
                                    {
                                        (this.props.StoreList || []).map((item, i) => {
                                            return (
                                                <Option key={item.HubID + ""}
                                                    value={item.HubID}>{item.HubName}</Option>
                                                );
                                        })
                                    }
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={5}>
                        <FormItem {...fLayout} label="分配状态：">
                            {getFieldDecorator("AllotType")(
                                <Select
                                    filterOption={this._filterOption}
                                    showSearch={true}
                                    allowClear={true}
                                    style={{ width: 120 }}
                                    placeholder='请选择分配状态'
                                    >
                                    <Option value={0}>全部</Option>
                                    <Option value={1}>正常</Option>
                                    <Option value={2}>超额</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col className="mb-16 text-right" offset={5}>
                        <Button onClick={this.handleFormReset}>重置</Button>
                        <Button className="ml-8" type="primary" htmlType="submit" onClick={this.check} >查询</Button>
                    </Col>
                </Row>
            </Form>
        );
    }
}

export default Form.create({
    mapPropsToFields(props) {
      const {
        RecruitTmpID, 
        LaborID, 
        RecruitDate, 
        HubID, 
        AllotType
      } = props.queryParams;
  
      return {
        RecruitTmpID, 
        LaborID, 
        RecruitDate, 
        HubID, 
        AllotType
      };
    },
    onFieldsChange(props, fields) {
      setParams(STATE_NAME, {
        queryParams: Object.assign({}, props.queryParams, fields)
      });
    }
  })(DistributionForm);