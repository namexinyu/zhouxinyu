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
import MemberDetailService from "SERVICE/Broker/MemberDetailService";
import moment from 'moment';
import AppSessionStorage from 'CONFIG/SessionStorage/AppSessionStorage';
import {
    Button,
    Icon,
    Row,
    Col,
    Modal,
    message,
    Menu,
    Dropdown,
    Table,
    Select,
    Card,
    Form,
    Input,
    InputNumber,
    Collapse,
    DatePicker,
    Cascader
} from 'antd';

const FormItem = Form.Item;
const {Option} = Select;
const Panel = Collapse.Panel;
const STATE_NAME = 'state_broker_member_detail_info';

class BlockDetailInfo extends React.PureComponent {
    constructor(props) {
        super(props);
        this.antOptions = getAntAreaOptions;
        this.state = {
            enableEdit: false,
            showDetail: false,
            showDropdown: false
        };
    }

    shouldComponentUpdate() {
        return true;
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.getMemberDetailInfoFetch.status === 'success') {
            setFetchStatus(STATE_NAME, 'getMemberDetailInfoFetch', 'close');
            let userInfo = nextProps.userInfo;
            setParams(STATE_NAME, {
                editAge: {
                    value: userInfo.Age || ''
                },
                editQQ: {
                    value: userInfo.QQ || ''
                },
                editWeChat: {
                    value: userInfo.WeChat || ''
                },
                editGender: userInfo.Gender.toString(),
                editCallName: {
                    value: userInfo.CallName
                }
            });
        }
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
                    UserID: this.props.userInfo.UserID,
                    BrokerID: this.props.brokerId
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

    handleBlurSave() {
        this.props.form.validateFieldsAndScroll(['editQQ', 'editWeChat', 'editGender', 'editCallName', 'editBirthday', 'editArea', 'editAddress'], (errors, values) => {
            if (!errors) {
                setMemberBaseInfo({
                    UpdateInfo: {
                        Address: this.props.editAddress.value || '',
                        AreaCode: this.props.editArea && this.props.editArea.value ? this.props.editArea.value[2] : '',
                        CallName: this.props.editCallName.value || '',
                        QQ: this.props.editQQ.value || '',
                        WeChat: this.props.editWeChat.value || '',
                        Gender: this.props.editGender ? parseInt(this.props.editGender, 10) : '',
                        Age: this.props.editAge && this.props.editAge.value ? this.props.editAge.value : 0
                    },
                    UserID: this.props.userInfo.UserID,
                    BrokerID: +this.props.brokerId
                });
            }
        });
    }

    handleChangeEditGender(value) {
        setParams(STATE_NAME, {
            editGender: value
        });
        if (value && this.props.editGender && parseInt(this.props.editGender.value, 10) != parseInt(value, 10)) {
            this.props.form.validateFieldsAndScroll(['editQQ', 'editWeChat', 'editGender', 'editCallName', 'editBirthday', 'editArea', 'editAddress'], (errors, values) => {
                if (!errors) {
                    setMemberBaseInfo({
                        UpdateInfo: {
                            Address: this.props.editAddress.value || '',
                            AreaCode: this.props.editArea && this.props.editArea.value ? this.props.editArea.value[2] : '',
                            CallName: this.props.editCallName.value || '',
                            QQ: this.props.editQQ.value || '',
                            WeChat: this.props.editWeChat.value || '',
                            Gender: parseInt(value, 10) || 0,
                            Age: this.props.editAge && this.props.editAge.value ? this.props.editAge.value : 0
                        },
                        UserID: this.props.userInfo.UserID,
                        BrokerID: +this.props.brokerId
                    });
                }
            });
        }
    }

    handleBlurSaveOther(record) {
        let param = {
            UserID: record.UserID,
            BrokerID: this.props.brokerId,
            WeChat: this.state['TmpWeChat' + record.UserID] || record.WeChat,
            QQ: this.state['TmpQQ' + record.UserID] || record.QQ
        };
        MemberDetailService.setMemberBaseInfo(param).then((res) => {
            if (res && !res.error) {
                message.success('修改成功');
                this.setState({showDropdown: false});
            }
        }, (err) => {
            message.destroy();
            message.success('修改失败' + err && err.Desc ? ':' + err.Desc : '');
        });
    }

    accountMenu() {
        let r_r = (this.props.userInfo || {}).List || [];
        const l_l = r_r.filter((v) => v.UserID !== (this.props.userInfo || {}).UserID);
        return (<Menu>
            {l_l.map((v, i_i) => {
                return <Menu.Item key={i_i}>
                    <Row type="flex" align="middle">
                        <Col span={6}>手机号：{v.Phone}</Col>
                        <Col span={8}>
                            <Form.Item labelCol={{span: 7}} wrapperCol={{span: 17}} label="微信" className="form-item__zeromb">
                                <Input value={this.state['TmpWeChat' + v.UserID] || v.WeChat}
                                       onChange={(e) => this.setState({['TmpWeChat' + v.UserID]: e.target.value})}
                                       placeholder="输入微信号"/>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item labelCol={{span: 7}} wrapperCol={{span: 17}} label="QQ" className="form-item__zeromb">
                                <Input value={this.state['TmpQQ' + v.UserID] || v.QQ}
                                       onChange={(e) => this.setState({['TmpQQ' + v.UserID]: e.target.value})}
                                       placeholder="输入QQ号"/>
                            </Form.Item>
                        </Col>
                        <Col span={2}><Button type="primary" size="small" style={{margin: '5px 6px'}}
                                              onClick={() => this.handleBlurSaveOther(v)}>修改</Button></Col>
                    </Row>
                </Menu.Item>;
            })}
        </Menu>);
    }

    render() {
        let {enableEdit, showDetail} = this.state;
        enableEdit = true; // 随时允许修改，失焦就保存
        const {getFieldDecorator} = this.props.form;
        let userInfo = this.props.userInfo;
        let areaCode = this.props.userInfo.AreaCode || '';
        let provinceCode = areaCode ? areaCode.toString().substr(0, 2) + '0000' : '';
        let cityCode = (areaCode.toString().substr(0, 2) === '11'
            || areaCode.toString().substr(0, 2) === '12'
            || areaCode.toString().substr(0, 2) === '31'
            || areaCode.toString().substr(0, 2) === '50'
            || areaCode.toString().substr(0, 2) === '81'
            || areaCode.toString().substr(0, 2) === '82') ? (areaCode ? areaCode.toString().substr(0, 2) + '0000' : '') : (areaCode ? areaCode.toString().substr(0, 4) + '00' : '');
        const l_l = (userInfo || {}).List || [];
        return (
            <div style={{minWidth: 340, width: '35%'}} className="info-new-header-box">
                <Form>
                    <Row type="flex" align="middle">
                        <Col span={11}>
                            {enableEdit && <FormItem label="QQ" labelCol={{span: 7}} wrapperCol={{span: 17}}>
                                {getFieldDecorator('editQQ', {
                                    rules: [
                                        {
                                            pattern: /^[0-9]+$/,
                                            message: 'QQ号码只能为数字'
                                        }
                                    ]
                                })(<Input type="text" onBlur={this.handleBlurSave.bind(this)}
                                          style={{border: '1px solid #108ee9', borderRadius: '4px'}}
                                          placeholder="QQ号"/>)}
                            </FormItem>}
                        </Col>
                        <Col span={11}>
                            {enableEdit && <FormItem label="微信" labelCol={{span: 7}} wrapperCol={{span: 17}}>
                                {getFieldDecorator('editWeChat', {
                                    rules: [
                                        // {
                                        //     pattern: /^[0-9a-zA-Z_-]+$/,
                                        //     message: '微信号码只能为数字和英文字母'
                                        // }
                                    ]
                                })(<Input type="text" onBlur={this.handleBlurSave.bind(this)}
                                          style={{border: '1px solid #108ee9', borderRadius: '4px'}}
                                          placeholder="微信号"/>)}
                            </FormItem>}
                        </Col>
                        {l_l.length > 1 ? <Col span={2} className="text-right">
                            <Dropdown overlay={this.accountMenu()} visible={this.state.showDropdown}
                                      placement="bottomRight">
                                <Icon onClick={() => this.setState({showDropdown: !this.state.showDropdown})}
                                      style={{
                                          display: 'block',
                                          width: '100%',
                                          fontSize: '18px',
                                          height: '40px',
                                          lineHeight: "40px",
                                          cursor: 'pointer'
                                      }} type="down"/>
                            </Dropdown>
                        </Col> : ''}
                    </Row>
                </Form>
            </div>
        );
    }
}

export default Form.create({
    mapPropsToFields(props) {
        return {
            editCallName: props.editCallName,
            editBirthday: props.editBirthday,
            editQQ: props.editQQ,
            editWeChat: props.editWeChat,
            editArea: props.editArea,
            editAddress: props.editAddress,
            editAge: props.editAge
        };
    },
    onFieldsChange(props, fields) {
        setParams(STATE_NAME, fields);
    }
})(BlockDetailInfo);
