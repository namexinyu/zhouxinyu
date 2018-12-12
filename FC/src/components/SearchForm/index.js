import React from 'react';
import {Form, Row, Col, Button, Input, Select, DatePicker, Radio} from 'antd';
import setParams from "ACTION/setParams";
import resetQueryParams from "ACTION/resetQueryParams";
import AutoCompleteSelect from 'COMPONENT/AutoCompleteSelect';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

// 123
class SearchForm extends React.PureComponent {
    constructor(props) {
        super(props);
        if (props.formItems == null || props.formItems == undefined) props.formItems = [];
        this.state = {};
        for (let key of Object.keys(props.dataSource || {})) {
            this.state[key] = props.dataSource[key];
        }
    }

    componentWillReceiveProps(nextProps) {
        let next_ds = nextProps.dataSource;
        let dsIsChange = false;
        for (let key of Object.keys(next_ds || {})) {
            if (next_ds[key] != this.state[key]) {
                dsIsChange = true;
                break;
            }
        }
        if (dsIsChange) {
            console.log("SearchForm dsIsChange ", next_ds);
            this.setState({...next_ds});
        }
    }

    handleReset() {
        resetQueryParams(this.props.state_name);
    }

    createItems() {
        const {getFieldDecorator} = this.props.form;
        const fLayout = {
            labelCol: {span: 10},
            wrapperCol: {span: 14}
        };
        return this.props.formItems.map((item, index) => {
            let formItem;
            switch (item.itemType) {
                case "Input":
                    formItem = getFieldDecorator(item.name, {rules: item.rules || []})(<Input type={"text" || item.type}
                                                                                              addonAfter={null || item.addonAfter}
                                                                                              placeholder={item.placeholder}/>);
                    break;
                case "DatePicker":
                    formItem = getFieldDecorator(item.name, {rules: item.rules || []})(<DatePicker
                        format={"YYYY-MM-DD" || item.format}
                        placeholder={item.placeholder}/>);
                    break;
                case "Select":
                    if (item.type == 'enum' && item.enum) {
                        item.list = Object.keys(item.enum);
                        formItem = getFieldDecorator(item.name, {rules: item.rules || []})(
                            <Select>
                                <Option value="-9999">全部</Option>
                                {(item.list).map((key, index) => {
                                    return <Option key={index} value={key + ''}>{item.enum[key]}</Option>;
                                })}
                            </Select>
                        );
                    } else if (item.type == 'list' && item.optionKey && item.optionValue) {
                        formItem = getFieldDecorator(item.name, {rules: item.rules || []})(
                            <Select>
                                <Option value="-9999">全部</Option>
                                {(this.state[item.list] || []).map((optionItem, index) => {
                                    return <Option key={index}
                                                   value={optionItem[item.optionKey] + ''}>{optionItem[item.optionValue]}</Option>;
                                })}
                            </Select>
                        );
                    }
                    break;
                case "Radio":
                    item.enum = item.enum || {};
                    item.list = Object.keys(item.enum) || [];
                    formItem = getFieldDecorator(item.name, {rules: item.rules || []})(
                        <RadioGroup>
                            {(item.list).map((key, index) => {
                                return <RadioButton key={index} value={key + ''}>{item.enum[key]}</RadioButton>;
                            })}
                        </RadioGroup>
                    );
                    break;
                case "AutoCompleteInput":
                    formItem = getFieldDecorator(item.name, {
                            // initialValue: item.value,
                            rules: item.rules || []
                        }
                    )(
                        <AutoCompleteSelect
                            allowClear={true}
                            placeholder={item.placeholder}
                            optionsData={{
                                valueKey: item.valueKey,
                                textKey: item.textKey,
                                dataArray: this.state[item.dataArray] || []
                            }}
                        ></AutoCompleteSelect>
                    );
                    break;
                default :
                    formItem = getFieldDecorator(item.name, {rule: item.rule || []})(<Input
                        placeholder={item.placeholder}/>);
                    break;
            }
            return (
                <Col key={index} className="gutter-box" span={6}>
                    <FormItem {...fLayout} label={item.label}>
                        {formItem}
                    </FormItem>
                </Col>);
        });
    }

    handleSearch(e) {
        if (e) e.preventDefault();
        this.props.form.validateFieldsAndScroll((errors, values) => {
            if (!errors) {
                if (this.props.handleSearch) this.props.handleSearch();
            }
        });

    }

    render() {

        return (
            <Form onSubmit={(e) => this.handleSearch(e)}>
                <Row gutter={15}>
                    {this.createItems()}
                    <Col className="gutter-box" span={6} offset={(3 - this.props.formItems.length % 4) * 6}>
                        <FormItem className="text-right">
                            <Button className="ant-btn ml-8" onClick={this.handleReset.bind(this)}>重置</Button>
                            <Button className="ant-btn ml-8" htmlType="submit" type="primary">搜索</Button>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        );
    }
}

let mapPropsToFields = (props) => {
    if (props.mapPropsToFields) return props.mapPropsToFields;
    // console.log('mapPropsToFields', props.queryParams);
    return Object.assign({}, props.queryParams);
};

let onFieldsChange = (props, fields) => {
    if (props.mapPropsToFields) return props.onFieldsChange;
    // console.log("onFieldsChange fields", fields);
    setParams(props.state_name, {queryParams: Object.assign({}, props.queryParams, fields)});
};

export default Form.create({mapPropsToFields, onFieldsChange})(SearchForm);