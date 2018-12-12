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
import moment from 'moment';
import getAntAreaOptions, {spreadAreaToPCA} from 'CONFIG/antAreaOptions';
import Mapping_MAMS_Recruitment, {
    getEnum,
    Mapping_MAMS_Recruit_User
} from 'CONFIG/EnumerateLib/Mapping_MAMS_Recruitment';
import resetQueryParams from "ACTION/resetQueryParams";
import PCA from "CONFIG/PCA";
import AutoCompleteSelect from 'COMPONENT/AutoCompleteSelect';
import {CurrentPlatformCode} from "CONFIG/mamsConfig";
import regexRule from 'UTIL/constant/regexRule';
import MAMSRecruitService from 'SERVICE/Common/MAMSRecruitService';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;

class RecruitmentForm extends React.PureComponent {
    constructor(props) {
        super(props);
        this.antOptions = [];
        console.log('getAntAreaOptions', getAntAreaOptions);
        // 取省市
        getAntAreaOptions.forEach((province) => {
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
        // console.log('getAntAreaOptions', getAntAreaOptions);
        getAntAreaOptions.splice(0, 0, {
            value: 'ff0000', label: "常用地区", children: [
                {value: '320509', label: '吴江区'},
                {value: '320583', label: '昆山市'},
                {value: '320500', label: '苏州市'},
                {value: '310000', label: '上海市'},
                {value: '321200', label: '泰州市'},
                {value: '320100', label: '南京市'},
                {value: '320200', label: '无锡市'},
                {value: '320581', label: '常熟市'},
                {value: '320400', label: '常州市'}
            ]
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
        this.MasterPushList = [{key: "2", value: "是"}, {key: "1", value: "否"}];
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

    handleCheckAllScope = (e) => {
        setParams('state_mams_recruitmentList', {
            exportScope: {
                checkAll: e.target.checked,
                checkedList: e.target.checked ? ['1', '320509', '320583', '320500', '-999'] : []
            }
        });
    }

    handleCheckScope = (checkedList) => {
        setParams('state_mams_recruitmentList', {
            exportScope: {
                checkAll: checkedList.length === ['1', '320509', '320583', '320500', '-999'].length,
                checkedList: checkedList
            }
        });
    }

    handleExport = () => {
        const { exportScope } = this.props;
        const queryParams = this.props.obtainQueryParam(this.props.pageState);
        queryParams.AreaCode = exportScope.checkedList.length ? 
            exportScope.checkedList.filter(val => +val !== 1) : ['320509', '320583', '320500', '-999'];

        queryParams.PayType = exportScope.checkedList.length ? (exportScope.checkedList.filter(val => +val === 1).length ? 1 : 0) : 1;
        
        MAMSRecruitService.ExportYellowPage(queryParams).then((res) => {
            if (res.Code === 0) {
                message.success('导出成功');
                window.open(res.Data, '_blank');
            } else {
                message.error(res.Desc || '导出失败，请稍后重试');
            }
        }).catch((err) => {
            message.error(err.Desc || '导出失败，请稍后重试');
        });
    }

    render() {
        const fLayout = {
            labelCol: {span: 8},
            wrapperCol: {span: 16}
        };
        const fLayout2 = {
            labelCol: {span: 6},
            wrapperCol: {span: 17}
        };

        const {
            form: {
                getFieldDecorator
            },
            exportScope
        } = this.props;

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
                                <Input placeholder="输入名称"/>
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
                    {/* <Col span={8}>
                        <FormItem {...fLayout} label="招聘状态">
                            {getFieldDecorator("RecruitStatus")(
                                <RadioGroup>
                                    {this.eRecruitStatusList.map((item, index) => {
                                        return (
                                            <Radio onClick={(e) => this.handleRadioClick('RecruitStatus', item.key, e)}
                                                   key={index} value={item.key}>{item.value}</Radio>);
                                    })}
                                </RadioGroup>
                            )}
                        </FormItem>
                    </Col> */}
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
                    <Col span={14}>
                        <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 20}} label="导出范围">
                            <div style={{ display: "flex" }}>
                                <Checkbox
                                    onChange={this.handleCheckAllScope}
                                    checked={exportScope.checkAll}
                                >
                                    全部
                                </Checkbox>
                                <CheckboxGroup value={exportScope.checkedList} onChange={this.handleCheckScope}>
                                    <Checkbox value="1">周薪薪</Checkbox>
                                    <Checkbox value="320509">吴江</Checkbox>
                                    <Checkbox value="320583">昆山</Checkbox>
                                    <Checkbox value="320500">苏州</Checkbox>
                                    <Checkbox value="-999">外面的世界</Checkbox>
                                </CheckboxGroup>
                            </div>
                            
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem {...fLayout} label="是否主推">
                            {getFieldDecorator("MasterPush")(
                                <RadioGroup>
                                    {this.MasterPushList.map((item, index) => {
                                        return (
                                            <Radio onClick={(e) => this.handleRadioClick('MasterPush', item.key, e)}
                                                   key={index} value={item.key}>{item.value}</Radio>);
                                    })}
                                </RadioGroup>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={22}>
                        <FormItem className="text-right">
                            <Button className="ant-btn ml-8" htmlType="submit" type="primary">查询</Button>
                            <Button className="ant-btn ml-8" onClick={this.handleReset.bind(this)}>重置</Button>
                            <Button className="ant-btn ml-8" type="primary" onClick={this.handleExport}>小黄图导出</Button>
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