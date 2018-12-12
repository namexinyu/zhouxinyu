import React from 'react';
import {Form, Row, Col, Button, Input, Select, Table, Checkbox, DatePicker, message, Radio} from 'antd';
import setParams from "ACTION/setParams";
import resetQueryParams from "ACTION/resetQueryParams";
import AutoCompleteSelect from 'COMPONENT/AutoCompleteSelect';
import AppSessionStorage from "CONFIG/SessionStorage/AppSessionStorage";
import moment from 'moment';
import resetState from 'ACTION/resetState';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const {RangePicker, MonthPicker} = DatePicker;

class CustomFormComponent extends React.PureComponent {
    constructor(props) {
        super(props);
        if (props.formItems == null || props.formItems == undefined) props.formItems = [];
        this.state = {};
        for (let key of Object.keys(props.dataSource || {})) {
            this.state[key] = props.dataSource[key];
        }
        this.formStyle = {
            itemSpan: props.itemSpan || 8
        };
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
        return this.props.formItems.map((item, index) => {
            let formItem;
            const fLayout = {
                labelCol: {span: 8 / (item.colSpan || 1)},
                wrapperCol: {span: 24 - (8 / (item.colSpan || 1))}
            };
            const itemConfig = item.itemConfig || {};
            switch (item.itemType) {
                case "Input":
                    formItem = getFieldDecorator(item.name, {rules: item.rules || []})(<Input type={"text" || item.type}
                                                                                              addonAfter={null || item.addonAfter}
                                                                                              placeholder={item.placeholder}/>);
                    break;
                case "DatePicker":
                    formItem = getFieldDecorator(item.name, {rules: item.rules || []})(
                        <DatePicker
                            format={itemConfig.format || "YYYY-MM-DD"}
                            alowClear={false}
                            showTime={itemConfig.showTime || undefined}
                            disabledDate={itemConfig.disabledDate || undefined}
                            placeholder={item.placeholder}
                            onChange={(a)=>{if(!a) this.setState(item.name, moment());}}
                            />);
                    break;
                case "MonthPicker":
                    formItem = getFieldDecorator(item.name, {rules: item.rules || []})(<MonthPicker
                        allowClear={false}
                        disabledDate={item.disabledDate}
                        placeholder={item.placeholder}/>);
                    break;
                case "RangePicker":
                    formItem = getFieldDecorator(item.name, {rules: item.rules || []})(<RangePicker
                        allowClear={false}
                        disabledDate={item.disabledDate}
                        format={"YYYY-MM-DD" || item.format}
                        placeholder={item.placeholder}/>);
                    break;
                case "Select":
                    if (item.type == 'enum') {
                        if (item.enum) {
                            item.list = Object.keys(item.enum);
                            formItem = getFieldDecorator(item.name, {rules: item.rules || []})(
                                <Select>
                                    <Option value="-9999">全部</Option>
                                    {(item.list).map((key, index) => {
                                        return <Option key={index} value={key + ''}>{item.enum[key]}</Option>;
                                    })}
                                </Select>
                            );
                        } else {
                            const valueKey = item.valueKey || 'key';
                            const textKey = item.textKey || 'value';
                            formItem = getFieldDecorator(item.name, {rules: item.rules || []})(
                                <Select>
                                    <Option value="-9999">全部</Option>
                                    {(item.list || []).map((v, index) => {
                                        return <Option key={index} value={v[valueKey] + ''}>{v[textKey]}</Option>;
                                    })}
                                </Select>
                            );
                        }

                    } else if (item.type == 'list' && item.optionKey && item.optionValue) {
                        let l_l = [];
                        if (Object.prototype.toString.call(this.state[item.list]) == '[object Array]') l_l = this.state[item.list];
                        formItem = getFieldDecorator(item.name, {rules: item.rules || []})(
                            <Select>
                                <Option value="-9999">全部</Option>
                                {l_l.map((optionItem, index) => {
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
                case 'Checkbox':
                    item.enum = item.enum || {};
                    const checkOptions = Object.keys(item.enum).map((key) => ({
                        label: item.enum[key],
                        value: key + ''
                    })) || [];
                    formItem = getFieldDecorator(item.name, {rules: item.rules || []})(
                        <CheckboxGroup options={checkOptions}/>
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
                case 'Text':
                    formItem = <span>{item.value}</span>;
                    break;
                default :
                    formItem = getFieldDecorator(item.name, {rule: item.rule || []})(<Input
                        placeholder={item.placeholder}/>);
                    break;
            }
            return (
                <Col key={index} className="gutter-box"
                     span={item.span || this.formStyle.itemSpan}
                     offset={item.offset || 0}>
                    <FormItem {...fLayout} label={item.label} style={{height: '32px'}}>
                        {formItem}
                    </FormItem>
                </Col>);
        });
    }

    // handleSearch(e) {
    //     if (e) e.preventDefault();
    //     this.props.form.validateFieldsAndScroll((errors, values) => {
    //         if (!errors) {
    //             if (this.props.handleSearch) this.props.handleSearch();
    //         }
    //     });
    //
    // }

    render() {
        return (
            <Form onSubmit={(e) => this.handleSearch(e)}>
                <Row gutter={16}>
                    {this.createItems()}
                </Row>
            </Form>
        );
    }
}

let mapPropsToFields = (props) => {
    if (props.mapPropsToFields) return props.mapPropsToFields;
    return Object.assign({}, props.params);
};

let onFieldsChange = (props, fields) => {
    if (props.mapPropsToFields) return props.onFieldsChange;
    // console.log("onFieldsChange fields", fields);
    setParams(props.state_name, {[props.param_key || "formData"]: Object.assign({}, props.params, fields)});
};


export default Form.create({mapPropsToFields, onFieldsChange})(CustomFormComponent);
