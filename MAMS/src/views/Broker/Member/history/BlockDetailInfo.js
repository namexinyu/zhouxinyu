import React from 'react';
import setParams from 'ACTION/setParams';
import resetState from 'ACTION/resetState';
import setFetchStatus from 'ACTION/setFetchStatus';
import Mapping_User from 'CONFIG/EnumerateLib/Mapping_User';
import setMemberBaseInfo from 'ACTION/Broker/MemberDetail/setMemberBaseInfo';
import openDialog from 'ACTION/Dialog/openDialog';
import PCA from 'CONFIG/PCA.js';
import getMemberDetailInfo from 'ACTION/Broker/MemberDetail/getMemberDetailInfo';
import ChArea from "CONFIG/ChArea";
import regex from 'UTIL/constant/regexRule';
import getAntAreaOptions from 'CONFIG/antAreaOptions';
import getPCA from 'CONFIG/getPCA';
import moment from 'moment';
import { Button, Icon, Row, Col, Modal, message, Menu, Dropdown, Table, Select, Card, Form, Input, Collapse, DatePicker, Cascader } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;
const Panel = Collapse.Panel;
const STATE_NAME = 'state_broker_member_detail_info';
class BlockDetailInfo extends React.PureComponent {
    constructor(props) {
        super(props);
        this.antOptions = getAntAreaOptions;
        this.state = {
            enableEdit: false,
            showDetail: false
        };
    }

    shouldComponentUpdate() {
        return true;
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.setMemberBaseInfoFetch.status === 'success') {
            setFetchStatus(STATE_NAME, 'setMemberBaseInfoFetch', 'close');
            message.success('修改成功');
            this.setState({
                enableEdit: false
            });
            getMemberDetailInfo({
                UserID: this.props.userInfo.UserID
            });
        }
        if (nextProps.setMemberBaseInfoFetch.status === 'error') {
            setFetchStatus(STATE_NAME, 'setMemberBaseInfoFetch', 'close');
            Modal.error({
                title: window.errorTitle.normal,
                content: nextProps.setMemberBaseInfoFetch.response.Desc
            });
        }
    }

    handleSeeUserInfo() {
        this.setState({
            showDetail: !this.state.showDetail
        });
    }

    handleEditBaseInfo(e) {
        e.stopPropagation();
        this.setState({
            enableEdit: true
        });
        let areaCode = this.props.userInfo.AreaCode || '';
        let provinceCode = areaCode ? areaCode.toString().substr(0, 2) + '0000' : '';
        let cityCode = (areaCode.toString().substr(0, 2) === '11'
            || areaCode.toString().substr(0, 2) === '12'
            || areaCode.toString().substr(0, 2) === '31'
            || areaCode.toString().substr(0, 2) === '50'
            || areaCode.toString().substr(0, 2) === '81'
            || areaCode.toString().substr(0, 2) === '82') ? (areaCode ? areaCode.toString().substr(0, 2) + '0000' : '') : (areaCode ? areaCode.toString().substr(0, 4) + '00' : '');
        setParams(STATE_NAME, {
            editCallName: {
                value: this.props.userInfo.CallName || ''
            },
            editArea: {
                value: [provinceCode, cityCode, areaCode]
            },
            editAddress: {
                value: this.props.userInfo.Address || ''
            },
            editQQ: {
                value: this.props.userInfo.QQ || ''
            },
            editWeChat: {
                value: this.props.userInfo.WeChat || ''
            },
            editGender: {
                value: this.props.userInfo.Gender.toString()
            },
            editBirthday: {
                value: this.props.userInfo.Birthday && this.props.userInfo.Birthday !== '0000-00-00' ? moment(this.props.userInfo.BirthDay) : ''
            }
        });
    }

    handleSaveBaseInfo(e) {
        e.stopPropagation();
        this.props.form.validateFieldsAndScroll(['editQQ', 'editWeChat', 'editGender', 'editCallName', 'editBirthday', 'editArea', 'editAddress'], (errors, values) => {
            if (!errors) {
                setMemberBaseInfo({
                    UpdateInfo: {
                        Address: this.props.editAddress.value || '',
                        AreaCode: this.props.editArea && this.props.editArea.value ? this.props.editArea.value[2] : '',
                        CallName: this.props.editCallName.value || '',
                        QQ: this.props.editQQ.value || '',
                        WeChat: this.props.editWeChat.value || '',
                        Gender: this.props.editGender.value ? parseInt(this.props.editGender.value, 10) : '',
                        Birthday: this.props.editBirthday.value ? this.props.editBirthday.value.format('YYYY-MM-DD') : ''
                    },
                    UserID: this.props.userInfo.UserID
                });
            }
        });

    }

    handleCancelEditBaseInfo(e) {
        e.stopPropagation();
        this.setState({
            enableEdit: false
        });
    }

    handleInputEditInfo(e, paramKey) {
        let temp = {};
        temp[paramKey] = e.target.value;
        setParams(STATE_NAME, temp);
    }

    handleCollapseChange(e) {
        this.setState({
            showDetail: !!(e.length && e.length > 0)
        });
    }
    render() {
        const { enableEdit, showDetail } = this.state;
        const { getFieldDecorator } = this.props.form;
        let userInfo = this.props.userInfo;
        let areaCode = this.props.userInfo.AreaCode || '';
        let provinceCode = areaCode ? areaCode.toString().substr(0, 2) + '0000' : '';
        let cityCode = (areaCode.toString().substr(0, 2) === '11'
            || areaCode.toString().substr(0, 2) === '12'
            || areaCode.toString().substr(0, 2) === '31'
            || areaCode.toString().substr(0, 2) === '50'
            || areaCode.toString().substr(0, 2) === '81'
            || areaCode.toString().substr(0, 2) === '82') ? (areaCode ? areaCode.toString().substr(0, 2) + '0000' : '') : (areaCode ? areaCode.toString().substr(0, 4) + '00' : '');
        return (
            <Collapse onChange={this.handleCollapseChange.bind(this)}>
                <Panel header={
                    <div>
                        <span>会员信息</span>
                        <div className="float-right">
                            {this.state.showDetail && this.state.enableEdit && <Button htmlType="button" size="small" className="mr-8" type="primary" onClick={(e) => this.handleSaveBaseInfo(e)} > 保存修改</Button>}
                            {this.state.showDetail && this.state.enableEdit && <Button htmlType="button" size="small" className="mr-8" onClick={(e) => this.handleCancelEditBaseInfo(e)} > 取消</Button>}
                            {this.state.showDetail && !this.state.enableEdit && <Button htmlType="button" size="small" className="mr-8" type="primary" onClick={(e) => this.handleEditBaseInfo(e)} > 修改信息</Button>}
                            <span className="color-primary mr-16">查看</span>
                        </div>
                    </div>
                } key="1">
                    <Row gutter={20}>
                        <Col span={8}>
                            <FormItem label="真实姓名" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                                <Input type="text" readOnly={true} value={userInfo.Name || '-'} />
                                {/* {userInfo.Name || '-'} */}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            {!enableEdit && <FormItem label="备注姓名" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                                <Input type="text" readOnly={true} value={userInfo.CallName || '-'} />
                                {/* {userInfo.CallName || '-'} */}
                            </FormItem>}
                            {enableEdit && <FormItem label="备注姓名" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                                {getFieldDecorator('editCallName', {
                                    rules: [
                                        {
                                            pattern: /^[\u4e00-\u9fa5a-zA-Z]+$/,
                                            message: '姓名必须为中文或英文字符'
                                        }
                                    ]
                                })(<Input type="text" maxLength="6" style={{ border: '2px solid #108ee9', borderRadius: '4px' }} placeholder="请输入联系用的小名" />)}
                            </FormItem>}
                        </Col>
                        <Col span={8}>
                            <FormItem label="软件昵称" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                                <Input type="text" readOnly={true} value={userInfo.NickName || '-'} />
                                {/* {userInfo.NickName || '-'} */}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            {(!enableEdit || userInfo.IDCardCert) && <FormItem label="性别" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                                <Input type="text" readOnly={true} value={Mapping_User.eGender[userInfo.Gender] || '-'} />
                                {/* {Mapping_User.eGender[userInfo.Gender]} */}
                            </FormItem>}
                            {enableEdit && !userInfo.IDCardCert && <FormItem label="性别" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                                {getFieldDecorator('editGender', {
                                    rules: []
                                })(<Select className="w-100" style={{ border: '2px solid #108ee9', borderRadius: '4px' }} placeholder="请选择性别">
                                    <Option value="1">男</Option>
                                    <Option value="2">女</Option>
                                </Select>)}
                            </FormItem>}
                        </Col>
                        <Col span={8}>
                            {(!enableEdit || userInfo.IDCardCert) && <FormItem label="出生日期" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                                <Input type="text" readOnly={true} value={userInfo.BirthDay === '0000-00-00' ? userInfo.BirthDay : (userInfo.BirthDay + '(' + ((new Date().getFullYear() - new Date(userInfo.BirthDay).getFullYear()) + '岁)') || '-')} />
                                {/* {userInfo.BirthDay === '0000-00-00' ? userInfo.BirthDay : (userInfo.BirthDay + '(' + ((new Date().getFullYear() - new Date(userInfo.BirthDay).getFullYear()) + '岁)') || '-')} */}
                            </FormItem>}
                            {enableEdit && !userInfo.IDCardCert && <FormItem label="出生日期" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                                {getFieldDecorator('editBirthday', {
                                    rules: []
                                })(<DatePicker style={{ border: '2px solid #108ee9', borderRadius: '4px' }} className="w-100" />)}
                            </FormItem>}
                        </Col>
                        <Col span={8}>
                            <FormItem label="民族" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                                <Input type="text" readOnly={true} value={userInfo.Nation || '-'} />
                                {/* {userInfo.Nation || '-'} */}
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            {!enableEdit && <FormItem label="现居住地" labelCol={{ span: 2 }} wrapperCol={{ span: 22 }}>
                                <Input type="text" readOnly={true} value={(!isNaN(provinceCode) ? (ChArea[provinceCode] || '') : '') + (!isNaN(cityCode) ? (ChArea[cityCode] || '') : '') + (!isNaN(areaCode) ? (ChArea[areaCode] || '') : '') + (userInfo.Address || '')} />
                                {/* {(!isNaN(provinceCode) ? (ChArea[provinceCode] || '') : '') + (!isNaN(cityCode) ? (ChArea[cityCode] || '') : '') + (!isNaN(areaCode) ? (ChArea[areaCode] || '') : '') + (userInfo.Address || '')} */}
                            </FormItem>}
                            {enableEdit && <Row>
                                <Col span={12}>
                                    <FormItem label="现居住地" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
                                        {getFieldDecorator('editArea', {
                                            rules: [
                                                {
                                                    validator: function (rule, value, callback) {
                                                        if (value && value.length > 0 && value.length < 3) {
                                                            callback('必须选择到县/区');
                                                        }
                                                        callback();
                                                    }
                                                }
                                            ]
                                        })(<Cascader style={{ border: '2px solid #108ee9', borderRadius: '4px' }} className="w-100" options={this.antOptions} placeholder="请选择省/市/区" changeOnSelect />)}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem labelCol={{ span: 0 }} wrapperCol={{ span: 24 }}>
                                        {getFieldDecorator('editAddress', {
                                            rules: []
                                        })(<Input type="text" style={{ border: '2px solid #108ee9', borderRadius: '4px' }} placeholder="请输入详细地址" />)}
                                    </FormItem>
                                </Col>
                            </Row>}
                        </Col>
                        <Col span={24}>
                            <FormItem label="身份证住址" labelCol={{ span: 2 }} wrapperCol={{ span: 22 }}>
                                <Input type="text" readOnly={true} value={userInfo.IDAddress ? (userInfo.IDAddress.split('区')[0].length > userInfo.IDAddress.split('县')[0].length ? userInfo.IDAddress.split('县')[0] + '******' : userInfo.IDAddress.split('区')[0]) + '******' : '-'} />
                                {/* {userInfo.IDAddress ? (userInfo.IDAddress.split('区')[0].length > userInfo.IDAddress.split('县')[0].length ? userInfo.IDAddress.split('县')[0] + '******' : userInfo.IDAddress.split('区')[0]) + '******' : '-'} */}
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <FormItem label="联系手机号" labelCol={{ span: 2 }} wrapperCol={{ span: 22 }}>
                                <Input type="text" readOnly={true} value={userInfo.LinkMobile || '-'} />
                                {/* {userInfo.LinkMobile || '-'} */}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem label="手机号码" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                                <Input type="text" readOnly={true} value={userInfo.Phone || '-'} />
                                {/* {userInfo.Phone || '-'} */}
                                {userInfo.PhoneHistoryList && userInfo.PhoneHistoryList.length > 0 && <Dropdown overlay={
                                    <Menu>
                                        {
                                            userInfo.PhoneHistoryList.map((item, i) => {
                                                return (
                                                    <Menu.Item>{item}</Menu.Item>
                                                );
                                            })
                                        }

                                    </Menu>
                                }>
                                    <a className="ant-dropdown-link" style={{ float: 'right' }} href="javascript:void(0)">
                                        历史记录 <Icon type="down" />
                                    </a>
                                </Dropdown>}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            {!enableEdit && <FormItem label="QQ号码" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                                <Input type="text" readOnly={true} value={userInfo.QQ || '-'} />
                                {/* {userInfo.QQ || '-'} */}
                            </FormItem>}
                            {enableEdit && <FormItem label="QQ号码" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                                {getFieldDecorator('editQQ', {
                                    rules: [
                                        {
                                            pattern: /^[0-9]+$/,
                                            message: 'QQ号码只能为数字'
                                        }
                                    ]
                                })(<Input type="text" style={{ border: '2px solid #108ee9', borderRadius: '4px' }} placeholder="请输入QQ号码" />)}
                            </FormItem>}
                        </Col>
                        <Col span={8}>
                            {!enableEdit && <FormItem label="微信号码" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                                <Input type="text" readOnly={true} value={userInfo.WeChat || '-'} />
                                {/* {userInfo.WeChat || '-'} */}
                            </FormItem>}
                            {enableEdit && <FormItem label="微信号码" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                                {getFieldDecorator('editWeChat', {
                                    rules: [
                                        {
                                            pattern: /^[0-9a-zA-Z_]+$/,
                                            message: '微信号码只能为数字和英文字母'
                                        }
                                    ]
                                })(<Input type="text" style={{ border: '2px solid #108ee9', borderRadius: '4px' }} placeholder="请输入微信号码" />)}
                            </FormItem>}
                        </Col>
                        <Col span={24}>
                            <FormItem label="推荐人" labelCol={{ span: 2 }} wrapperCol={{ span: 22 }}>
                                <Input type="text" readOnly={true} value={userInfo.InviteName || '-'} />
                                {/* {userInfo.InviteName || '-'} */}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem label="身份证" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                                {userInfo.IDCardCert ? <span className="color-green">已通过</span> : <span className="color-red">未认证</span>}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem label="工牌" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                                {userInfo.EmployeeCardState === 2 ? <span className="color-green">{('审核通过' + '(' + (userInfo.EmployeeCardRecruit || '-') + ')')}</span>
                                    : (userInfo.EmployeeCardState === 1 ? <span className="color-warning">审核中</span> : (userInfo.EmployeeCardState === 3 ? <span className="color-red">审核失败</span> : <span className="color-red">未上传</span>))}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem label="银行卡" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                                {userInfo.BankCardNum ? <span className="color-green">{userInfo.BankCardNum}张</span> : <span className="color-red">0张</span>}
                            </FormItem>
                        </Col>
                    </Row>
                </Panel>
            </Collapse>
        );
    }
}

export default Form.create({
    mapPropsToFields(props) {
        return {
            editCallName: props.editCallName,
            editGender: props.editGender,
            editBirthday: props.editBirthday,
            editQQ: props.editQQ,
            editWeChat: props.editWeChat,
            editArea: props.editArea,
            editAddress: props.editAddress
        };
    },
    onFieldsChange(props, fields) {
        setParams(STATE_NAME, fields);
    }
})(BlockDetailInfo);