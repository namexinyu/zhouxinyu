import React from 'react';
import { browserHistory } from 'react-router';
import MemberTags from 'CONFIG/EnumerateLib/Mapping_MemberTags';
import setParams from 'ACTION/setParams';
import getMemberTags from 'ACTION/Broker/MemberDetail/getMemberTags';
import setMemberTags from 'ACTION/Broker/MemberDetail/setMemberTags';
import openDialog from 'ACTION/Dialog/openDialog';
import setFetchStatus from 'ACTION/setFetchStatus';
import resetQueryParams from "ACTION/resetQueryParams";
import Mapping_MAMS_Recruitment, {
    getEnum,
    Mapping_MAMS_Recruit_User
} from 'CONFIG/EnumerateLib/Mapping_MAMS_Recruitment';
import moment from 'moment';
import AutoCompleteSelect from 'COMPONENT/AutoCompleteSelect';
import { Button, Icon, Row, Col, Modal, Radio, message, Checkbox, Table, Select, Card, Form, Input, Collapse, DatePicker, Cascader, Tag } from 'antd';

const { TextArea } = Input;
const FormItem = Form.Item;
const { Option } = Select;
const Panel = Collapse.Panel;
const { Column, ColumnGroup } = Table;
const RadioGroup = Radio.Group;
const STATE_NAME = 'state_broker_member_detail_tags';

class BlockMemberTags extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            showDetail: false
        };

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

    componentWillMount() {
        let location = browserHistory.getCurrentLocation();
        if (location.lastKey !== location.key && !(location.state && location.state.clickTab)) {
            this.getMemberTags(this.props);
        }
    }

    shouldComponentUpdate() {
        return true;
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.getMemberTagsFetch.status === 'success') {
            setFetchStatus(STATE_NAME, 'getMemberTagsFetch', 'close');
            let tags = JSON.parse(nextProps.getMemberTagsFetch.response.Data.UserTags || '{}') || {};
            let temp = {};
            for (let k in tags) {
                temp[k] = {
                    value: tags[k]
                };
            }
            setParams(STATE_NAME, temp);
        }
        if (nextProps.getMemberTagsFetch.status === 'error') {
            setFetchStatus(STATE_NAME, 'getMemberTagsFetch', 'close');
            message.error('获取会员进厂标签失败');
        }
        if (nextProps.setMemberTagsFetch.status === 'success') {
            setFetchStatus(STATE_NAME, 'setMemberTagsFetch', 'close');
            message.success('设置成功');
            this.getMemberTags(nextProps);
        }
        if (nextProps.setMemberTagsFetch.status === 'error') {
            setFetchStatus(STATE_NAME, 'setMemberTagsFetch', 'close');
            Modal.error({
                title: window.errorTitle.normal,
                content: nextProps.setMemberTagsFetch.response.Desc
            });
        }
    }

    handleTagChange(e, paramKey, other) {
        let temp = {
            memberTags: this.props.memberTags
        };
        if (other) {
            temp.memberTags[other][paramKey] = e.target.checked;
        } else {
            temp.memberTags[paramKey] = e.target.value;
        }

        setParams(STATE_NAME, temp);
    }

    handleSave() {
        this.props.form.validateFieldsAndScroll((errors, values) => {
            if (!errors) {
                let obj = {
                    IDCardType: this.props.IDCardType.value || '',
                    Education: this.props.Education.value || '',
                    Characters: this.props.Characters.value || '',
                    Math: this.props.Math.value || '',
                    ForeignBodies: this.props.ForeignBodies.value || '',
                    Criminal: this.props.Criminal.value || '',
                    Clothes: this.props.Clothes.value || '',
                    Tattoo: this.props.Tattoo.value || [],
                    SmokeScar: this.props.SmokeScar.value || []
                };
                setMemberTags({
                    UserID: this.props.userId,
                    UserTags: JSON.stringify(obj)
                });
            }
        });
    }

    getMemberTags(props) {
        getMemberTags({
            UserID: props.userId
        });
    }

    handleToggleBox() {
        this.setState({
            showDetail: !this.state.showDetail
        });
    }

    handleToRecruitSearch() {
        browserHistory.push({
            pathname: '/broker/recruit/info',
            query: {
                MemberPhone: this.props.userPhone
            }
        });
    }
    handleCollapseChange() {

    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const fLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
        };
        const fLayout2 = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 }
        };
        return (
            <Collapse onChange={this.handleCollapseChange.bind(this)}>
                <Panel header={
                    <div>
                        <span>进厂标签</span>
                        <div className="float-right">
                            <Button htmlType="button" type="primary" size="small" className="mr-8" onClick={() => this.handleToRecruitSearch()}>匹配工作</Button>
                            <span className="color-primary mr-16">查看</span>
                        </div>
                    </div>
                } key="1">
                    <Row>
                        <Col span={12}>
                            <FormItem {...fLayout} label="身份证类型">
                                {getFieldDecorator("IDCardType")(
                                    <RadioGroup>
                                        {this.euIDCardTypeList.map((item, index) => {
                                            return (<Radio key={index} value={item.key}>{item.value}</Radio>);
                                        })}
                                    </RadioGroup>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...fLayout} label="毕业证">
                                {getFieldDecorator("Education")(
                                    <Select className="w-100" placeholder="请选择毕业证要求">
                                        <Select.Option value="-9999">全部</Select.Option>
                                        {this.euEducationList.map((item, index) => {
                                            return (<Select.Option key={index}
                                                value={item.key}>{item.value}</Select.Option>);
                                        })}
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...fLayout} label="听说读写（英文）">
                                {getFieldDecorator("Characters")(
                                    <RadioGroup>
                                        {this.euCharactersList.map((item, index) => {
                                            return (<Radio key={index} value={item.key}>{item.value}</Radio>);
                                        })}
                                    </RadioGroup>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...fLayout} label="简单算数">
                                {getFieldDecorator("Math")(
                                    <RadioGroup>
                                        {this.euMathList.map((item, index) => {
                                            return (<Radio key={index} value={item.key}>{item.value}</Radio>);
                                        })}
                                    </RadioGroup>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...fLayout} label="体内异物">
                                {getFieldDecorator("ForeignBodies")(
                                    <RadioGroup>
                                        {this.euForeignBodiesList.map((item, index) => {
                                            return (<Radio key={index} value={item.key}>{item.value}</Radio>);
                                        })}
                                    </RadioGroup>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...fLayout} label="犯罪记录">
                                {getFieldDecorator("Criminal")(
                                    <RadioGroup>
                                        {this.euCriminalList.map((item, index) => {
                                            return (<Radio key={index} value={item.key}>{item.value}</Radio>);
                                        })}
                                    </RadioGroup>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...fLayout} label="无尘服">
                                {getFieldDecorator("Clothes")(
                                    <RadioGroup>
                                        {this.euClothesList.map((item, index) => {
                                            return (<Radio key={index} value={item.key}>{item.value}</Radio>);
                                        })}
                                    </RadioGroup>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <FormItem {...fLayout2} label="纹身">
                                {getFieldDecorator("Tattoo")(
                                    <Checkbox.Group>
                                        {this.euTattooList.map((item, index) => {
                                            return (<Checkbox key={index} value={item.key}>{item.value}</Checkbox>);
                                        })}
                                    </Checkbox.Group>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <FormItem {...fLayout2} label="烟疤">
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
                    <Row className="text-center">
                        <Button type="primary" htmlType="button" onClick={() => this.handleSave()}>保存</Button>
                    </Row>
                </Panel>
            </Collapse>
            // <div className="container-fluid">
            //     <div className="card">
            //         <div className="card-header">进场标签
            //             <div className="float-right input-group-sm">
            //                 <span className="btn btn-sm btn-info ml-3" style={{lineHeight: 1}}
            //                       onClick={() => this.handleToRecruitSearch()}>匹配工作</span>
            //                 <span className="d-inline-block ml-5" onClick={() => this.handleToggleBox()}>查看</span>
            //             </div>
            //         </div>
            //         <div className={'card-body' + (this.state.showDetail ? '' : ' d-none')}>
            //             <div className="form-inline">
            //                 <div className="form-group mr-3">
            //                     <label htmlFor="" className="mr-2">身份证</label>
            //                     <select name="" id="" className="form-control"
            //                             value={this.props.memberTags.IDCardStatus}
            //                             onChange={(e) => this.handleTagChange(e, 'IDCardStatus')}>
            //                         <option value="">请选择</option>
            //                         {
            //                             Object.entries(MemberTags.IDCardStatus).map((item, i) => {
            //                                 return (
            //                                     <option key={i} value={item[0]}>{item[1]}</option>
            //                                 );
            //                             })
            //                         }
            //                     </select>
            //                 </div>
            //                 <div className="form-group mr-3">
            //                     <label htmlFor="" className="mr-2">纹身</label>
            //                     <select name="" id="" className="form-control"
            //                             value={this.props.memberTags.TattooStatus}
            //                             onChange={(e) => this.handleTagChange(e, 'TattooStatus')}>
            //                         <option value="">请选择</option>
            //                         {
            //                             Object.entries(MemberTags.TattooStatus).map((item, i) => {
            //                                 return (
            //                                     <option key={i} value={item[0]}>{item[1]}</option>
            //                                 );
            //                             })
            //                         }
            //                     </select>
            //                 </div>
            //                 <div className="form-group mr-3">
            //                     <label htmlFor="" className="mr-2">烟疤</label>
            //                     <select name="" id="" className="form-control"
            //                             value={this.props.memberTags.SmokeScarStatus}
            //                             onChange={(e) => this.handleTagChange(e, 'SmokeScarStatus')}>
            //                         <option value="">请选择</option>
            //                         {
            //                             Object.entries(MemberTags.SmokeScarStatus).map((item, i) => {
            //                                 return (
            //                                     <option key={i} value={item[0]}>{item[1]}</option>
            //                                 );
            //                             })
            //                         }
            //                     </select>
            //                 </div>
            //                 <div className="form-group mr-3">
            //                     <label htmlFor="" className="mr-2">无尘服</label>
            //                     <select name="" id="" className="form-control"
            //                             value={this.props.memberTags.CleanClothesStatus}
            //                             onChange={(e) => this.handleTagChange(e, 'CleanClothesStatus')}>
            //                         <option value="">请选择</option>
            //                         {
            //                             Object.entries(MemberTags.CleanClothesStatus).map((item, i) => {
            //                                 return (
            //                                     <option key={i} value={item[0]}>{item[1]}</option>
            //                                 );
            //                             })
            //                         }
            //                     </select>
            //                 </div>
            //                 <div className="form-group mr-3">
            //                     <label htmlFor="" className="mr-2">上班姿势</label>
            //                     <select name="" id="" className="form-control"
            //                             value={this.props.memberTags.WorkPostureStatus}
            //                             onChange={(e) => this.handleTagChange(e, 'WorkPostureStatus')}>
            //                         <option value="">请选择</option>
            //                         {
            //                             Object.entries(MemberTags.WorkPostureStatus).map((item, i) => {
            //                                 return (
            //                                     <option key={i} value={item[0]}>{item[1]}</option>
            //                                 );
            //                             })
            //                         }
            //                     </select>
            //                 </div>
            //             </div>
            //             <div className="form-inline mt-3">
            //                 <div className="form-group mr-3">
            //                     <label htmlFor="" className="mr-2">其他</label>
            //                     {
            //                         Object.entries(MemberTags.OtherStatus).map((item, i) => {
            //                             return (
            //                                 <div className="form-check" key={i}>
            //                                     <label className="custom-control custom-checkbox">
            //                                         <input type="checkbox" className="custom-control-input"
            //                                                checked={this.props.memberTags.OtherStatus[item[0]] === true}
            //                                                onChange={(e) => this.handleTagChange(e, item[0], 'OtherStatus')}/>
            //                                         <span className="custom-control-indicator"></span>
            //                                         <span
            //                                             className="custom-control-description">{item[1]}</span>
            //                                     </label>
            //                                 </div>
            //                             );
            //                         })
            //                     }

            //                 </div>
            //             </div>
            //             <div className="container-fluid">
            //                 <button className="btn btn-info" type="button" onClick={() => this.handleSave()}>保存</button>
            //             </div>
            //         </div>
            //     </div>
            // </div>
        );
    }
}

export default Form.create({
    mapPropsToFields(props) {
        return {
            IDCardType: props.IDCardType,
            Education: props.Education,
            Characters: props.Characters,
            Math: props.Math,
            ForeignBodies: props.ForeignBodies,
            Criminal: props.Criminal,
            Clothes: props.Clothes,
            Tattoo: props.Tattoo,
            SmokeScar: props.SmokeScar
        };
    },
    onFieldsChange(props, fields) {
        setParams(STATE_NAME, fields);
    }
})(BlockMemberTags);