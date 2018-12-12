import React from 'react';
import {Form, Row, Col, Radio, Input, Select, Cascader, InputNumber} from 'antd';
import RecommendSalary from './RecommendSalary';
import LabourCosts from './LabourCosts';
import Subsidies from "./Subsidies";
import RecruitAge from "./RecruitAge";
import EnrollFees from "./EnrollFees";
import GenderRatio from "./GenderRatio";
import RecruitTag from "./RecruitTag";
import {CONFIG} from 'mams-com';
import 'ASSET/less/Business/ent/ent-form.less';

const antOptions = CONFIG.antAreaOptions;

const formItemLayout1 = {labelCol: {span: 1}, wrapperCol: {span: 23}};
const formItemLayout2 = {labelCol: {span: 2}, wrapperCol: {span: 22}};
const formItemLayout4 = {labelCol: {span: 4}, wrapperCol: {span: 18}};
const formItemLayout5 = {labelCol: {span: 5}, wrapperCol: {span: 19}};
const formItemLayout6 = {labelCol: {span: 6}, wrapperCol: {span: 18}};
const formItemLayout7 = {labelCol: {span: 8}, wrapperCol: {span: 14}};
const EntBasic = Form.create({
    mapPropsToFields: props => ({...props.params}),
    onFieldsChange: (props, fields) => props.setParams(fields)
})(({form, handleSeeMap, handleTagAdd, tagMax, type, setParams, params, LabourCostType, isEdit}) => {
    const {getFieldDecorator} = form;
    const span = type === 'modal' ? 12 : 8;
    const Typespan = type === 'modal' ? 5 : 8;
    const formItemLayout = type === 'modal' ? formItemLayout4 : formItemLayout6;
    const TypeformItemLayout = type === 'modal' ? formItemLayout7 : formItemLayout6;
    return (
        <Form className='ent-form'>
            <Row>
                <Col span={span}>
                    <Form.Item {...formItemLayout} label="企业简称">
                        {getFieldDecorator('EntShortName', {
                            rules: [
                                {required: true, message: '企业简称必填'},
                                {validator: (rule, value, cb) => cb(!(/\s+/g.test(value)) ? undefined : '不能包含空格')}
                            ]
                        })(
                            <Input style={{width: '100%'}} maxLength="50"/>
                        )}
                    </Form.Item>
                </Col>
                <Col span={Typespan}>
                    <Form.Item {...TypeformItemLayout} label="发薪方式">
                        {getFieldDecorator('PayType', {initialValue: '1'})(
                            <Select disabled={isEdit}>
                                <Select.Option value='0'>按月</Select.Option>
                                <Select.Option value='1'>按周</Select.Option>
                            </Select>
                        )}
                    </Form.Item>
                </Col>

                <Col span={Typespan}>
                    <Form.Item {...TypeformItemLayout} label="周薪薪类型">
                        {getFieldDecorator('ZXXType', {
                            initialValue: '1'
                        })(
                            <Select placeholder="请选择">
                                <Select.Option value='1'>1.0</Select.Option>
                                <Select.Option value='2'>2.0</Select.Option>
                            </Select>
                        )}
                    </Form.Item>
                </Col>
                
                {/* {
                    params.PayType == undefined ? <Col span={Typespan}>
                        <Form.Item {...TypeformItemLayout} label="周薪薪类型">
                            {getFieldDecorator('ZXXType', {initialValue: '1'})(
                                <Select>
                                    <Select.Option value='1'>1.0</Select.Option>
                                    <Select.Option value='2'>2.0</Select.Option>
                                </Select>
                            )}
                        </Form.Item>
                        </Col> : (params.PayType.value * 1 == 1 ? <Col span={Typespan}>
                        <Form.Item {...TypeformItemLayout} label="周薪薪类型">
                            {getFieldDecorator('ZXXType', {initialValue: '1'})(
                                <Select>
                                    <Select.Option value='1'>1.0</Select.Option>
                                    <Select.Option value='2'>2.0</Select.Option>
                                </Select>
                            )}
                        </Form.Item>
                        </Col> : "")
                } */}
                <Col span={span}>
                    <Form.Item {...formItemLayout} label="综合薪资">
                        {getFieldDecorator('Salary', {
                            initialValue: {start: 0, end: 0},
                            rules: [
                                {required: true, message: '综合薪资必填'},
                                {validator: (rule, value, cb) => cb(value.start === 0 || value.end === 0 ? '综合薪资必填' : undefined)},
                                {validator: (rule, value, cb) => cb(value.start > value.end ? '金额无效' : undefined)}
                            ]
                        })(<RecommendSalary/>)}
                    </Form.Item>
                </Col>
            </Row>
            {/* <Row>
                <Col span={24}>
                    <Form.Item {...formItemLayout2} label="工价">
                        <Radio.Group
                            onChange={(e) => setParams({[e.target.name]: e.target.value})}
                            name='LabourCostType' value={LabourCostType}>
                            <Radio value={0}>最终工价</Radio>
                            <Radio value={1}>基本工价+补贴工价</Radio>
                        </Radio.Group>
                        {getFieldDecorator('LabourCostList', {
                            initialValue: []
                        })(<LabourCosts LabourCostType={LabourCostType}/>)}
                    </Form.Item>
                </Col>
            </Row> */}
            {/* <Row>
                <Col span={12}>
                    <Form.Item {...formItemLayout4} label="补贴">
                        {getFieldDecorator('SubsidyList', {
                            initialValue: [],
                            rules: [
                                {validator: (rule, value, cb) => cb(Subsidies.SubsidyAmountInvalid(value, 10000) ? '补贴价格不可>10000元' : undefined)}
                            ]
                        })(<Subsidies/>)}
                    </Form.Item>
                    <Form.Item {...formItemLayout4} label=" " colon={false}>
                        {getFieldDecorator('SubsidyRemark', {
                            initialValue: ''
                        })(<Input.TextArea autosize={{minRows: 4, maxRows: 8}}
                                           maxLength="100"
                                           placeholder="补贴备注，例如需要打卡多少天"/>)}
                    </Form.Item>
                </Col>

                <Col span={12}>
                    <Form.Item {...formItemLayout4} label="收费">
                        {getFieldDecorator('EnrollFeeList', {initialValue: []})(<EnrollFees/>)}
                    </Form.Item>
                </Col>
            </Row> */}

            {/* <Row>
                <Col span={12}>
                    <Form.Item {...formItemLayout4} label="性别比例">
                        {getFieldDecorator('GenderRatio', {
                            rules: [
                                {validator: (rule, value, cb) => cb(GenderRatio.invalid(value, false) ? '比例只能为自然数' : undefined)}
                            ]
                        })(<GenderRatio/>)}
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item {...formItemLayout4} label="年龄">
                        {getFieldDecorator('RecruitAge', {
                            rules: [
                                {validator: (rule, value, cb) => cb(RecruitAge.validAge(value, false))}
                            ]
                        })(<RecruitAge/>)}
                    </Form.Item>
                </Col>
            </Row> */}

            <Row>
                <Col span={24}>
                    <Form.Item {...formItemLayout2} label="企业标签">
                        {getFieldDecorator('RecruitTagConfIDs')(
                            <RecruitTag handleTagAdd={handleTagAdd} max={tagMax}/>)}
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <Form.Item {...formItemLayout2} label="温馨提示">
                        {getFieldDecorator('WarmTip', {
                            initialValue: ''
                        })(<Input placeholder='请输入提示信息' maxLength="500"/>)}
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col span={10}>
                    <Form.Item {...formItemLayout5} label="所属地区">
                        {getFieldDecorator('AreaCode', {
                            rules: [{
                                required: true,
                                message: '请选择所属地区'
                            }, {
                                validator: (rule, value, cb) => cb(value && value instanceof Array && value.length === 3 ? undefined : '请选择省市区')
                            }]
                        })(<Cascader options={antOptions} placeholder="请选择省/市/区" changeOnSelect showSearch/>)}
                    </Form.Item>
                </Col>
                <Col span={13}>
                    <Form.Item {...formItemLayout1} label=" " colon={false}>
                        {getFieldDecorator('Address', {
                            initialValue: '',
                            rules: [
                                {validator: (rule, value, cb) => cb(value ? undefined : '请输入详细地址')}
                            ]
                        })(<Input placeholder='请输入详细地址' maxLength="50"/>)}
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col span={10}>
                    <Form.Item {...formItemLayout5} label="地理定位">
                        {getFieldDecorator('Longlat', {
                            rules: [{required: true, message: '请查看地图选择位置'}]
                        })(<Input placeholder="右侧查看地图选择位置" disabled={true}/>)}
                    </Form.Item>
                </Col>
                <Col span={10}>
                    <Form.Item {...{
                        labelCol: {span: 10},
                        wrapperCol: {span: 12}
                    }} label="定位半径（米）">
                        {getFieldDecorator('ClockRadius', {
                            rules: [{required: true, message: '请查看地图选择位置'}]
                        })(<InputNumber placeholder="右侧查看地图选择位置" className='w-100' disabled={true}/>)}
                    </Form.Item>
                </Col>
                <Col span={4}>
                    <Form.Item>
                        <a onClick={handleSeeMap}>查看地图</a>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
});

EntBasic.obtainQueryParams = (values, LabourCostType) => {
    values = {...values};
    let param = {};
    param.EntShortName = values.EntShortName;
    param.PayType = Number(values.PayType);
    param.MinSalary = values.Salary.start * 100;
    param.MaxSalary = values.Salary.end * 100;
    // param.SubsidyList = values.SubsidyList.map(item => ({...item, SubsidyAmount: item.SubsidyAmount * 100}));
    // param.SubsidyRemark = values.SubsidyRemark;
    // param.EnrollFeeList = values.EnrollFeeList.map(item => ({...item, Fee: item.Fee * 100}));
    // param.GenderRatio = values.GenderRatio && (values.GenderRatio.male || values.GenderRatio.female) ? `${values.GenderRatio.male || 0 }:${values.GenderRatio.female || 0}` : '';
    param.WarmTip = values.WarmTip;
    if (param.PayType == 1) {
        param.ZXXType = Number(values.ZXXType);
    } else {
        param.ZXXType = 0;
    }
    param.RecruitTagConfIDs = (values.RecruitTagConfIDs || []).reduce((pre, cur, index, array) => {
        pre += cur.TagID;
        if (index + 1 !== array.length) pre += ',';
        return pre;
    }, '');
    param.AreaCode = values.AreaCode[2];
    param.Address = values.Address;
    param.Longlat = values.Longlat;
    param.ClockRadius = values.ClockRadius;
    if (values.RecruitAge) {
        param.MaleMinAge = Number(values.RecruitAge.MaleMinAge || 0);
        param.MaleMaxAge = Number(values.RecruitAge.MaleMaxAge || 0);
        param.FeMaleMinAge = Number(values.RecruitAge.FeMaleMinAge || 0);
        param.FeMaleMaxAge = Number(values.RecruitAge.FeMaleMaxAge || 0);
    }
    // param.LabourCostList = values.LabourCostList.map(item => ({
    //     ...item,
    //     SubsidyUnitPay: LabourCostType ? Number.parseInt(item.SubsidyUnitPay * 100, 10) : 0,
    //     UnitPay: Number.parseInt(item.UnitPay * 100, 10)
    // }));
    return param;
};

export default EntBasic;