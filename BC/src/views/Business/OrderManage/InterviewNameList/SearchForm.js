import React from 'react';
import {
    Row,
    Col,
    Card,
    Form,
    Input,
    Alert,
    Table,
    Icon,
    Button,
    DatePicker,
    message,
    Radio,
    Select,
    Modal,
    Popconfirm
} from 'antd';
import createPureComponent from 'UTIL/createPureComponent';
import moment from 'moment';
import AutoCompleteInput from 'COMPONENT/AutoCompleteInput';

const FormItem = Form.Item;
const Option = Select.Option;

const SearchForm = Form.create({
    mapPropsToFields: props => ({...props.queryParams}),
    onFieldsChange: (props, fields) => props.setParams('queryParams', fields)
})(createPureComponent(({handleFormSubmit, handleFormReset, form, common, tabKey}) => {
    const {getFieldDecorator} = form;
    const formItemLayout = {labelCol: {span: 5}, wrapperCol: {span: 16}};
    const isAll = tabKey === 'tab1';
    return (
        <Form onSubmit={(e) => {
            e.preventDefault();
            form.validateFields((err, fieldsValue) => {
                console.log(err, fieldsValue);
                if (err) return;
                handleFormSubmit(fieldsValue);
            });
        }}>
            <Row type="flex" justify="start">
                {isAll && <Col span={8}>
                    <FormItem {...formItemLayout} label="签到日期">
                        {getFieldDecorator('Date', {rules: [{required: true}], message: '请选择签到日期'})(
                            <DatePicker style={{width: '100%'}} allowClear={false}
                                        disabledDate={(value) => {
                                            if (!value) return false;
                                            return value.valueOf() > moment().valueOf() || value.valueOf() < moment().subtract(1, 'year').valueOf();
                                        }}
                            />
                        )}
                    </FormItem>
                </Col>}
                <Col span={8}>
                    <FormItem {...formItemLayout} label="劳务公司">
                        {getFieldDecorator('Labor')(
                            <AutoCompleteInput
                                textKey="ShortName" valueKey="LaborID"
                                dataSource={common.LaborSimpleList}/>
                        )}
                    </FormItem>
                </Col>
                <Col span={8}>
                    <FormItem {...formItemLayout} label="企业">
                        {getFieldDecorator('Recruit', {initialValue: null})(
                            <AutoCompleteInput
                                textKey="RecruitName" valueKey="RecruitTmpID"
                                dataSource={common.RecruitSimpleList}/>
                        )}
                    </FormItem>
                </Col>
                <Col span={8}>
                    <FormItem {...formItemLayout} label="会员姓名">
                        {getFieldDecorator('RealName')(
                            <Input placeholder="请输入会员姓名"/>
                        )}
                    </FormItem>
                </Col>
                <Col span={8}>
                    <FormItem {...formItemLayout} label="手机号码">
                        {getFieldDecorator('Mobile')(
                            <Input placeholder="请输入手机号码"/>
                        )}
                    </FormItem>
                </Col>

                
                {isAll && <Col span={8}>
                    <FormItem {...formItemLayout} label="手动绑定">
                        {getFieldDecorator('BindRecruitSubsidy')(
                            <Select>
                                <Option value="-9999">全部</Option>
                                <Option value="2">已绑定</Option>
                                <Option value="1">未绑定</Option>
                                <Option value="-1">异常绑定</Option>
                            </Select>
                        )}
                    </FormItem>
                </Col>}

                {isAll && <Col span={8}>
                    <FormItem {...formItemLayout} label="结算状态">
                        {getFieldDecorator('SettleStatus')(
                            <Select>
                                <Option value="0">全部</Option>
                                <Option value="1">待结算</Option>
                                <Option value="3">结算中</Option>
                                <Option value="2">已结算</Option>
                            </Select>
                        )}
                    </FormItem>
                </Col>}

                {isAll && <Col span={8}>
                    <FormItem {...formItemLayout} label="是否周薪薪">
                        {getFieldDecorator('PayType')(
                            <Select>
                                <Option value="-9999">全部</Option>
                                <Option value="0">按月</Option>
                                <Option value="1">周薪薪</Option>
                            </Select>
                        )}
                    </FormItem>
                </Col>}

            </Row>
            <Row>
                <Col className="mb-24" span={23} style={{textAlign: 'right'}}>
                    <Button type="primary" htmlType="submit">查询</Button>
                    <Button className="ml-8" onClick={handleFormReset}>重置</Button>
                </Col>
            </Row>
        </Form>
    );
}));

export default SearchForm;