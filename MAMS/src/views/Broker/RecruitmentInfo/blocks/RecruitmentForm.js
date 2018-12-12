import React from 'react';
import Viewer from 'react-viewer';
import 'react-viewer/dist/index.css';

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
    InputNumber,
    Tag,
    Table
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
import {RegexRule, Constant} from 'UTIL/constant/index';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { Column } = Table;


class RecruitmentForm extends React.PureComponent {
    constructor(props) {
        super(props);
        this.antOptions = [];
        console.log('getAntAreaOptions', getAntAreaOptions);
        this.state = {
            showNormalArea: false,
            previewImages: [],
            previewImagesVisible: false
        };
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
        console.log('getAntAreaOptions', getAntAreaOptions);
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
        const {
            state_name,
            tagStockList,
            checkedTags,
            checkedTagStockList
        } = this.props;
        resetQueryParams(state_name);
        
        setParams(state_name, {
            checkedTags: [],
            checkedTagStockList: [],
            tagStockList: tagStockList.concat(checkedTagStockList)
        });
    }

    handleRadioChange = (e, record) => {
        const value = e.target.value || {};
        const {
            checkedTags,
            checkedTagStockList,
            tagStockList
        } = this.props;
        setParams(this.props.state_name, {
            checkedTags: checkedTags.concat([{
                CommonTagID: value.CommonTagID,
                CommonTagDetailID: value.CommonTagDetailID,
                TagContent: value.TagContent,
                TagName: record.TagName
            }]),
            checkedTagStockList: checkedTagStockList.concat(tagStockList.filter(item => item.CommonTagID === value.CommonTagID)),
            tagStockList: tagStockList.filter(item => item.CommonTagID !== value.CommonTagID)
        });
    }

    handleCloseTag = (CommonTagID) => {
        const {
            checkedTags,
            checkedTagStockList,
            tagStockList
        } = this.props;

        const removedTagItem = checkedTagStockList.filter(item => item.CommonTagID === CommonTagID);

        setParams(this.props.state_name, {
            checkedTags: checkedTags.filter(item => item.CommonTagID !== CommonTagID),
            checkedTagStockList: checkedTagStockList.filter(item => item.CommonTagID !== CommonTagID),
            tagStockList: tagStockList.concat(removedTagItem)
        });
    }

    organiseCheckedTagStockList = (data, checkedTags) => {
        console.log('organiseCheckedTagStockList', data);
        var checkedValue = checkedTags[checkedTags.length - 1] || {};
        return data.map(item => {
            return {
                ...item,
                TagBody: (item.TagBody || []).filter(current => {
                    return !!checkedTags.filter(checked => checked.CommonTagDetailID === current.CommonTagDetailID).length;
                })
            };
        }).filter(item => !!item.TagBody.length).filter(item => item.TagRemark != '' || item.TagBody[0].TagSpeech != '').reduce((wrap, current) => {
            if (current.TagRemark != '' && current.TagBody[0].TagSpeech != '') {
                return wrap.concat([{
                    TagName: current.TagName,
                    TagRemark: current.TagRemark,
                    TagSpeech: current.TagBody[0].TagSpeech,
                    TagPicture: (current.TagBody || []).reduce((accumulator, item) => {
                        return accumulator.concat((item.TagPicPath || []));
                    }, []),
                    columnType: 'TagSpeech',
                    rowSpan: 2
                }, {
                    TagName: current.TagName,
                    TagRemark: current.TagRemark,
                    TagSpeech: current.TagBody[0].TagSpeech,
                    TagPicture: (current.TagBody || []).reduce((accumulator, item) => {
                        return accumulator.concat((item.TagPicPath || []));
                    }, []),
                    columnType: 'TagRemark',
                    rowSpan: 0
                }]);
            } else {
                return wrap.concat([{
                    TagName: current.TagName,
                    TagRemark: current.TagRemark,
                    TagSpeech: current.TagBody[0].TagSpeech,
                    TagPicture: (current.TagBody || []).reduce((accumulator, item) => {
                        return accumulator.concat((item.TagPicPath || []));
                    }, []),
                    rowSpan: 1,
                    columnType: current.TagRemark === '' ? 'TagSpeech' : 'TagRemark'
                }]);  
            }
        }, []);
    }

    handlePreivewImage = (imgs, i, record) => {
        const removedImg = imgs.splice(i, 1);
        
        this.setState({
            previewImagesVisible: true,
            previewImages: removedImg.concat(imgs).map(pic => {
                return {
                    src: pic
                };
            })
        });
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
        console.log('render form', this.props);
        const {
            tagStockList,
            checkedTags,
            checkedTagStockList
        } = this.props;

        const {
            previewImagesVisible,
            previewImages
        } = this.state;

        console.log('checkedTags', checkedTags);

        const processedCheckedTagStockList = this.organiseCheckedTagStockList(checkedTagStockList, checkedTags);
        console.log('processedCheckedTagStockList', processedCheckedTagStockList);
        

        return (
            <Form onSubmit={(e) => this.handleSubmit(e)} style={{
                width: "100%"
            }}>
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
                    {/* <Col span={6}>
                        <Button className="ant-btn ml-8" htmlType="submit" type="primary">查询</Button>
                        <Button className="ant-btn ml-8" onClick={this.handleReset.bind(this)}>重置</Button>
                    </Col> */}

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

                </Row>
                <Row gutter={16}>
                    
                    {/* <Col span={6}>
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
                    </Col> */}
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
                    {/* <Col span={6} style={{textAlign: "right"}}>
                        <span onClick={() => {
                            setParams(this.props.state_name, {spreadMatchEnt: !this.props.spreadMatchEnt});
                        }} style={{fontSize: '14px'}} className="ml-16">
                            <a>会员筛选</a><Icon className="ml-8" type={this.props.spreadMatchEnt ? 'up' : 'down'}/>
                        </span>
                        <span onClick={() => {
                            setParams(this.props.state_name, {spreadMatchEnt: !this.props.spreadMatchEnt});
                        }} style={{fontSize: '14px'}} className="ml-16">
                            <a>标签筛选</a><Icon className="ml-8" type={this.props.spreadMatchEnt ? 'up' : 'down'}/>
                        </span>
                    </Col> */}
                </Row>

                {this.props.spreadMemberType ? (
                    <Row gutter={16} className="pt-8" style={{borderTop: '1px solid #cccccc'}}>
                        <Col span={CurrentPlatformCode == 'broker1' ? 8 : 0}>
                            <FormItem className="match-input" {...fLayout} label="会员手机">
                                {getFieldDecorator("Phone", {
                                    rules: [{pattern: RegexRule.mobile, message: '请输入正确的手机号'}]
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
                
                {this.props.spreadTagType ? (
                    <Row className="pt-8" style={{borderTop: '1px solid #cccccc'}}>
                        <Col span={24}>
                            <Row>
                                <Col span={21}>
                                    <FormItem label="已选标签" labelCol={{span: 2}} wrapperCol={{span: 22}}>
                                        <div>
                                            {checkedTags.map(item => (
                                                <Tag
                                                    key={item.CommonTagID}
                                                    closable
                                                    onClose={() => this.handleCloseTag(item.CommonTagID)}>
                                                    {item.TagName + '：' + item.TagContent}
                                                </Tag>
                                            ))}

                                        </div>
                                    </FormItem>
                                </Col>
                                <Col span={3} style={{textAlign: "right"}}>
                                    <span onClick={() => {
                                        setParams(this.props.state_name, {spreadCheckTag: !this.props.spreadCheckTag});
                                    }} style={{fontSize: '14px'}} className="ml-16">
                                        <a>收起筛选</a><Icon className="ml-8" type={this.props.spreadCheckTag ? 'up' : 'down'}/>
                                    </span>
                                </Col>
                            </Row>
                            {this.props.spreadCheckTag ? (
                                <div style={{
                                    overflow: "hidden",
                                    overflowY: "auto",
                                    maxHeight: "260px"
                                }}>
                                    <Row>
                                        <Col span={24}>
                                            {!!tagStockList.length && (
                                                <Table
                                                    rowKey={(record, index) => index}
                                                    dataSource={tagStockList}
                                                    bordered={true}
                                                    showHeader={false}
                                                    pagination={false}
                                                >
                                                    <Column
                                                        title="企业标签"
                                                        dataIndex="TagName"
                                                        width={230}
                                                    />
                                                    <Column
                                                        title="标签内容"
                                                        dataIndex="TagBody"
                                                        render={(text, record) => {
                                                            return (
                                                                <RadioGroup onChange={(e) => this.handleRadioChange(e, record)}>
                                                                    {record.TagBody.map((item) => (
                                                                        <Radio key={item.CommonTagDetailID} value={item}>{item.TagContent}</Radio>
                                                                    ))}
                                                                </RadioGroup>
                                                            );
                                                        }}
                                                    />
                                                </Table>
                                            )}
                                            
                                        </Col>
                                    </Row>
                                </div>
                                
                            ) : ''}

                            {processedCheckedTagStockList.length ? (
                                <div className="mt-16" style={{
                                    overflow: "hidden",
                                    overflowY: "auto",
                                    maxHeight: "260px"
                                }}>
                                    <Row>
                                        <Col span={24}>
                                                <Table
                                                    rowKey={(record, index) => index}
                                                    dataSource={processedCheckedTagStockList}
                                                    bordered={true}
                                                    showHeader={false}
                                                    pagination={false}
                                                >
                                                    <Column
                                                        title="企业标签"
                                                        dataIndex="TagName"
                                                        width={230}
                                                        render={(text, record, index) => {
                                                            if (record.rowSpan == null || record.rowSpan === 1) {
                                                                return {
                                                                children: text,
                                                                props: {}
                                                                };
                                                            }

                                                            return {
                                                                children: text,
                                                                props: {
                                                                    rowSpan: record.rowSpan 
                                                                }
                                                            };
                                                        }}
                                                    />
                                                    <Column
                                                        title="话术及备注"
                                                        key="RemarkAndSpeech"
                                                        render={(text, record) => {
                                                            return (
                                                                <div className="flex">
                                                                    <div className="flex__item">
                                                                        {`${record.columnType === 'TagRemark' ? '备注' : '话术'}：${record.columnType === 'TagRemark' ? record.TagRemark : record.TagSpeech}`}
                                                                    </div>
                                                                    {(record.rowSpan === 1 || record.rowSpan === 0) && (
                                                                        <div>
                                                                            {record.TagPicture.map((pic, i) => (
                                                                                <Icon style={{
                                                                                    fontSize: "22px",
                                                                                    color: "#3399e7"
                                                                                }} className="ml-8" onClick={() => this.handlePreivewImage(record.TagPicture, i)} type="picture" key={i} />
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                    
                                                                </div>
                                                            );
                                                        }}
                                                    />
                                                </Table>
                                            
                                        </Col>
                                    </Row>
                                </div>
                            ) : ''}
                            
                            
                        </Col>
                    </Row>
                ) : ''}
                
                
                <Row gutter={16} style={{padding: "6px 0"}}>
                    <Col span={8} offset={16}>
                        <FormItem className="text-right">
                            <Button className="ant-btn ml-8" htmlType="submit" type="primary">查询</Button>
                            <Button className="ant-btn ml-8" onClick={this.handleReset.bind(this)}>重置</Button>
                            <span style={{fontSize: '14px'}}
                                  onClick={() => setParams(this.props.state_name, {spreadMemberType: !this.props.spreadMemberType})}
                                  className="ml-16">
                                <a>会员筛选</a><Icon className="ml-8" type={this.props.spreadMemberType ? 'up' : 'down'}/>
                            </span>
                            <span style={{fontSize: '14px'}}
                                  onClick={() => setParams(this.props.state_name, {spreadTagType: !this.props.spreadTagType})}
                                  className="ml-16">
                                <a>标签筛选</a><Icon className="ml-8" type={this.props.spreadTagType ? 'up' : 'down'}/>
                            </span>
                        </FormItem>
                    </Col>
                </Row>
                <Viewer
                    visible={previewImagesVisible}
                    drag={false}
                    zoomable={false}
                    rotatable={false}
                    scalable={false}
                    noImgDetails={true}
                    attribute={false}
                    noNavbar={true}
                    onClose={() => { this.setState({ previewImagesVisible: false }); } }
                    images={previewImages}
                />
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