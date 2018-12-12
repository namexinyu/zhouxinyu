import React from 'react';
import {
    Form,
    Row,
    Col,
    Button,
    Checkbox,
    Input,
    Cascader,
    Select,
    Icon,
    DatePicker,
    message,
    Radio,
    InputNumber
} from 'antd';
import setParams from "ACTION/setParams";
import Mapping_MAMS_Recruitment, {
    getEnum,
    Mapping_MAMS_Recruit_User
} from 'CONFIG/EnumerateLib/Mapping_MAMS_Recruitment';
import resetQueryParams from "ACTION/resetQueryParams";
import {CurrentPlatformCode} from "CONFIG/mamsConfig";

import {CONFIG, UTIL} from 'mams-com';

const {antAreaOptions, PCA} = CONFIG;

const regexRule = UTIL.Constant.RegexRule;

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class RecruitmentForm extends React.PureComponent {
    constructor(props) {
        super(props);
        this.antOptions = [];
        // 取省市
        antAreaOptions.forEach((province) => {
            const item = {
                value: province.value,
                label: province.label,
                children: []
            };
            province.children.forEach((city) => {
                item.children.push({
                    value: city.value,
                    label: city.label,
                    children: []
                });
            });
            this.antOptions.push(item);
        });
        this.eChargeList = Mapping_MAMS_Recruitment.eHasChargeList;
        this.eSubsidyList = Mapping_MAMS_Recruitment.eHasSubsidyList;
        this.eRecommendList = Mapping_MAMS_Recruitment.eIsRecommendList;
        this.ePhysicalList = Mapping_MAMS_Recruitment.ePhysicalList;
        this.eGenderList = Mapping_MAMS_Recruitment.eGenderList;
        this.eReturnRequireList = Mapping_MAMS_Recruitment.eReturnRequireList;
        this.eCharge = getEnum(Mapping_MAMS_Recruitment.eHasChargeList);
        this.eSubsidy = getEnum(Mapping_MAMS_Recruitment.eHasSubsidyList);
        this.eRecommend = getEnum(Mapping_MAMS_Recruitment.eIsRecommendList);
        this.ePhysical = getEnum(Mapping_MAMS_Recruitment.ePhysicalList);
        this.eGender = getEnum(Mapping_MAMS_Recruitment.eGenderList);
        this.eReturnRequire = getEnum(Mapping_MAMS_Recruitment.eReturnRequireList);
        // 会员
        this.euCensusList = Object.keys(PCA.Province).map((key) => ({key: key, value: PCA.Province[key]}));
        this.euNationInfoList = Mapping_MAMS_Recruit_User.euNationInfoList.map((value) => ({key: value, value: value}));

        this.euIDCardTypeList = Mapping_MAMS_Recruit_User.euIDCardTypeList;
        this.euEducationList = Mapping_MAMS_Recruit_User.euEducationList;
        this.euClothesList = Mapping_MAMS_Recruit_User.euClothesList;
        this.euCharactersList = Mapping_MAMS_Recruit_User.euCharactersList;
        this.euForeignBodiesList = Mapping_MAMS_Recruit_User.euForeignBodiesList;
        this.euMathList = Mapping_MAMS_Recruit_User.euMathList;
        this.euCriminalList = Mapping_MAMS_Recruit_User.euCriminalList;
        this.euSmokeScarList = Mapping_MAMS_Recruit_User.euSmokeScarList;
        this.euTattooList = Mapping_MAMS_Recruit_User.euTattooList;

    }

    handleSubmit(e) {
        if (e) e.preventDefault();
        if (this.props.handleSearch) this.props.handleSearch();
        // this.props.form.validateFieldsAndScroll((errors, values) => {
        //     if (!errors) {
        //         if (this.props.handleSearch) this.props.handleSearch();
        //     }
        // });
    }

    handleDoMatch() {
        this.props.form.validateFieldsAndScroll((errors, values) => {
            if (!errors) {
                if (this.props.handleMatch) this.props.handleMatch();
            }
        });
    }

    handleRadioClick(param, value, e) {
        let queryParams = this.props.queryParams;
        if (!param || !queryParams[param]) return;
        console.log('handleRadioClick', queryParams[param].value, value);
        if (queryParams[param].value == value) {
            setParams(this.props.state_name, {queryParams: Object.assign({}, this.props.queryParams, {[param]: {value: undefined}})});
            if (e) e.preventDefault();
        }
    }

    handleReset() {
        resetQueryParams(this.props.state_name);
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const fLayout = {
            labelCol: {span: 8},
            wrapperCol: {span: 16}
        };
        const fLayout2 = {
            labelCol: {span: 6},
            wrapperCol: {span: 17}
        };

        return (
            <Form onSubmit={(e) => this.handleSubmit(e)}>
                <Row gutter={16}>
                    <Col span={8}>
                        <FormItem {...fLayout} label="日期">
                            {getFieldDecorator("RecruitDate")(
                                <DatePicker placeholder="选择日期" allowClear={false} format="YYYY-MM-DD"/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem {...fLayout} label="企业简称">
                            {getFieldDecorator("RecruitName")(
                                <Input placeholder="输入名称" maxLength="64" />
                            )}
                        </FormItem>
                    </Col>
                    
                    <Col span={8}>
                        <FormItem {...fLayout} label="是否补贴">
                            {getFieldDecorator("HasSubsidy")(
                                <RadioGroup>
                                    {this.eSubsidyList.map((item, index) => {
                                        return (<Radio onClick={(e) => this.handleRadioClick('HasSubsidy', item.key, e)}
                                                       key={index}
                                                       value={item.key}>{item.value}</Radio>);
                                    })}
                                </RadioGroup>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem {...fLayout} label="是否收费">
                            {getFieldDecorator("HasEnrollFee")(
                                <RadioGroup>
                                    {this.eChargeList.map((item, index) => {
                                        return (<Radio onClick={(e) => this.handleRadioClick('HasEnrollFee', item.key, e)}
                                                       key={index} value={item.key}>{item.value}</Radio>);
                                    })}
                                </RadioGroup>
                            )}
                        </FormItem>
                    </Col>
                    {/* <Col span={8}>*/}
                    {/* <FormItem {...fLayout} label="是否体检">*/}
                    {/* {getFieldDecorator("Physical")(*/}
                    {/* <RadioGroup>*/}
                    {/* {this.ePhysicalList.map((item, index) => {*/}
                    {/* return (<Radio onClick={(e) => this.handleRadioClick('Physical', item.key, e)}*/}
                    {/* key={index} value={item.key}>{item.value}</Radio>);*/}
                    {/* })}*/}
                    {/* </RadioGroup>*/}
                    {/* )}*/}
                    {/* </FormItem>*/}
                    {/* </Col>*/}
                    <Col span={8}>
                        <FormItem {...fLayout} label="返厂规定">
                            {getFieldDecorator("ReturnRequire")(
                                <RadioGroup>
                                    {this.eReturnRequireList.map((item, index) => {
                                        return (
                                            <Radio onClick={(e) => this.handleRadioClick('ReturnRequire', item.key, e)}
                                                   key={index} value={item.key}>{item.value}</Radio>);
                                    })}
                                </RadioGroup>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                {this.props.spread ? (
                    <Row gutter={16} className="pt-8" style={{borderTop: '1px solid #cccccc'}}>
                        <Col span={CurrentPlatformCode == 'broker' ? 8 : 0}>
                            <FormItem className="match-input" {...fLayout} label="会员手机">
                                {getFieldDecorator("Phone", {
                                    rules: [{pattern: regexRule.mobile, message: '请输入正确的手机号'}]
                                })(
                                    <Input placeholder="输入手机号"
                                           addonAfter={(
                                               <div onClick={() => this.handleDoMatch()}>匹配</div>)}/>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem {...fLayout} label="会员年龄">
                                {getFieldDecorator("Age")(
                                    <InputNumber placeholder="输入年龄"/>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem {...fLayout} label="会员性别">
                                {getFieldDecorator("Gender")(
                                    <RadioGroup>
                                        {this.eGenderList.map((item, index) => {
                                            return (<Radio
                                                onClick={(e) => this.handleRadioClick('Gender', item.key, e)}
                                                key={index} value={item.key}>{item.value}</Radio>);
                                        })}
                                    </RadioGroup>
                                )}
                            </FormItem>
                        </Col>

                        {/* <Col span={8}>*/}
                        {/* <FormItem {...fLayout} label="户籍">*/}
                        {/* {getFieldDecorator("Census")(*/}
                        {/* <Cascader options={this.antOptions}*/}
                        {/* // onChange={(value) => this.handleSetParam('AreaCode', value)}*/}
                        {/* placeholder="请选择省/市/区" changeOnSelect/>*/}
                        {/* )}*/}
                        {/* </FormItem>*/}
                        {/* </Col>*/}


                        {/* <Col span={8}>*/}
                        {/* <FormItem {...fLayout} label="民族">*/}
                        {/* {getFieldDecorator("NationInfo")(*/}
                        {/* <AutoCompleteSelect*/}
                        {/* allowClear={true}*/}
                        {/* placeholder="输入民族"*/}
                        {/* optionsData={{*/}
                        {/* valueKey: "key",*/}
                        {/* textKey: "value",*/}
                        {/* dataArray: this.euNationInfoList*/}
                        {/* }}*/}
                        {/* ></AutoCompleteSelect>*/}
                        {/* )}*/}
                        {/* </FormItem>*/}
                        {/* </Col>*/}

                        <Col span={8}>
                            <FormItem {...fLayout} label="身份证类型">
                                {getFieldDecorator("IDCardType")(
                                    <RadioGroup>
                                        {this.euIDCardTypeList.map((item, index) => {
                                            return (
                                                <Radio onClick={(e) => this.handleRadioClick('IDCardType', item.key, e)}
                                                       key={index} value={item.key}>{item.value}</Radio>);
                                        })}
                                    </RadioGroup>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem {...fLayout} label="毕业证">
                                {getFieldDecorator("Education")(
                                    <Select>
                                        <Select.Option value="-9999">全部</Select.Option>
                                        {this.euEducationList.map((item, index) => {
                                            return (<Select.Option key={index}
                                                                   value={item.key}>{item.value}</Select.Option>);
                                        })}
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem {...fLayout} label="听说读写（英文）">
                                {getFieldDecorator("Characters")(
                                    <RadioGroup>
                                        {this.euCharactersList.map((item, index) => {
                                            return (
                                                <Radio onClick={(e) => this.handleRadioClick('Characters', item.key, e)}
                                                       key={index} value={item.key}>{item.value}</Radio>);
                                        })}
                                    </RadioGroup>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem {...fLayout} label="简单算数">
                                {getFieldDecorator("Math")(
                                    <RadioGroup>
                                        {this.euMathList.map((item, index) => {
                                            return (
                                                <Radio onClick={(e) => this.handleRadioClick('Math', item.key, e)}
                                                       key={index} value={item.key}>{item.value}</Radio>);
                                        })}
                                    </RadioGroup>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem {...fLayout} label="体内异物">
                                {getFieldDecorator("ForeignBodies")(
                                    <RadioGroup>
                                        {this.euForeignBodiesList.map((item, index) => {
                                            return (<Radio
                                                onClick={(e) => this.handleRadioClick('ForeignBodies', item.key, e)}
                                                key={index} value={item.key}>{item.value}</Radio>);
                                        })}
                                    </RadioGroup>
                                )}
                            </FormItem>
                        </Col>

                        <Col span={8}>
                            <FormItem {...fLayout} label="无尘服">
                                {getFieldDecorator("Clothes")(
                                    <RadioGroup>
                                        {this.euClothesList.map((item, index) => {
                                            return (
                                                <Radio onClick={(e) => this.handleRadioClick('Clothes', item.key, e)}
                                                       key={index} value={item.key}>{item.value}</Radio>);
                                        })}
                                    </RadioGroup>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem {...fLayout} label="纹身">
                                {getFieldDecorator("Tattoo")(
                                    <Checkbox.Group>
                                        {this.euTattooList.map((item, index) => {
                                            return (<Checkbox key={index} value={item.key}>{item.value}</Checkbox>);
                                        })}
                                    </Checkbox.Group>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem {...fLayout} label="烟疤">
                                {getFieldDecorator("SmokeScar")(
                                    <Checkbox.Group>
                                        {this.euSmokeScarList.map((item, index) => {
                                            return (<Checkbox key={index} value={item.key}>{item.value}</Checkbox>);
                                        })}
                                    </Checkbox.Group>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                ) : ''}
                <Row gutter={16}>
                    <Col span={8} offset={16}>
                        <FormItem className="text-right">
                            <Button className="ant-btn ml-8" htmlType="submit" type="primary">查询</Button>
                            <Button className="ant-btn ml-8" onClick={this.handleReset.bind(this)}>重置</Button>
                            <span style={{fontSize: '14px'}}
                                  onClick={() => setParams(this.props.state_name, {spread: !this.props.spread})}
                                  className="ml-16">
                                <a>会员筛选</a><Icon className="ml-8" type={this.props.spread ? 'up' : 'down'}/>
                            </span>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        );
    }
}

const getFormProps = (props) => {
    let res = {};
    Object.keys(props.queryParams).forEach((key) => {
        res[key] = Object.assign({}, props.queryParams[key]);
    });
    return res;
};

export default Form.create({
    mapPropsToFields(props) {
        return getFormProps(props);
    },
    // onValuesChange(props, values) {
    //     setParams(STATE_NAME, values);
    // },
    onFieldsChange(props, fields) {
        setParams(props.state_name, {queryParams: Object.assign({}, props.queryParams, fields)});
    }
})(RecruitmentForm);
