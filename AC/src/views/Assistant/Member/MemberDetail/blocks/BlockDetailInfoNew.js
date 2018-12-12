import React from 'react';
import setParams from 'ACTION/setParams';
import resetState from 'ACTION/resetState';
import setFetchStatus from 'ACTION/setFetchStatus';
import Mapping_User from 'CONFIG/EnumerateLib/Mapping_User';
import setMemberBaseInfo from 'ACTION/Broker/MemberDetail/setMemberBaseInfo';
import brokerCall from 'ACTION/Broker/MemberDetail/brokerCallBack';
import openDialog from 'ACTION/Dialog/openDialog';
import PCA from 'CONFIG/PCA.js';
import getMemberDetailInfo from 'ACTION/Broker/MemberDetail/getMemberDetailInfo';
import ChArea from "CONFIG/ChArea";
import regex from 'UTIL/constant/regexRule';
import getAntAreaOptions from 'CONFIG/antAreaOptions';
import getPCA from 'CONFIG/getPCA';
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
    Popover,
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
            webCallVisible: false
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

        if (nextProps.processInfo.brokerCallFetch.status === 'success') {
            setFetchStatus('state_broker_member_detail_process', 'brokerCallFetch', 'close');
            message.success('号码已推送，请在手机上直接拨打');
        }

        if (nextProps.processInfo.brokerCallFetch.status === 'error') {
            setFetchStatus('state_broker_member_detail_process', 'brokerCallFetch', 'close');
            message.error(nextProps.processInfo.brokerCallFetch.response.Desc);
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
                    BrokerID: this.props.brokerId
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
                        BrokerID: this.props.brokerId
                    });
                }
            });
        }
    }

    handleBrokerCall = (phone) => {
        console.log('handleBrokerCall', phone);
        brokerCall({
          BrokerID: this.props.brokerId,
          Message: `${phone}`
        });
    }

    handleWebCallPopoverVisible = (visible) => {
      this.setState({
        webCallVisible: visible
      });
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
        
        const callMenuPopover = (
            <ul>
                {(userInfo.List || []).map((item, index) => {
                return (
                    <li key={index}>
                    <div className="flex flex--y-center">
                        <span>电话：{item.Phone}</span>
                        <Icon className="icon-call" type="phone" onClick={() => this.handleBrokerCall(item.Phone)} />
                    </div>
                    </li>
                );
                })}
            </ul>
        );

        return (
            <div>
                <Form>
                    <Row>
                        <Col span={24}>
                            <Row>
                                <Col span={8}>
                                    <div className="flex flex--y-center">
                                        <div className="flex flex--y-center">
                                            <Icon type="credit-card" style={{fontSize: '24px'}}/>
                                        
                                            {userInfo.BankCardNum ? <span className="color-green ml-8" style={{fontSize: 16}}>{userInfo.BankCardNum}张</span> :
                                                <span className="color-red ml-8" style={{fontSize: 16}}>0张</span>}
                                        </div>

                                        {/* {new Date().getMonth() === new Date(userInfo.BirthDay).getMonth() && (new Date().getDate() === new Date(userInfo.BirthDay).getDate() || new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1).getDate() === new Date(userInfo.BirthDay).getDate()) &&
                                            <span className="iconfont icon-wannianli-07 ml-10" style={{
                                                fontSize: '24px',
                                                color: 'rgb(255, 202, 134)'
                                            }}></span>} */}

                                        {(userInfo.List || []).length > 1 ? (
                                            <Popover
                                                overlayClassName="web-call-popover"
                                                content={callMenuPopover}
                                                title="拨打电话"
                                                placement="bottom"
                                                trigger="click"
                                                visible={this.state.webCallVisible}
                                                onVisibleChange={this.handleWebCallPopoverVisible}
                                            >
                                                <i className="iconfont icon-dianhua d-inline-block color-blue cursor-pointer ml-10" style={{fontSize: 24}}></i>
                                            </Popover>
                                            ) : (
                                            <i style={{fontSize: 24}} className="iconfont icon-dianhua d-inline-block color-blue cursor-pointer ml-10"
                                                onClick={() => this.handleBrokerCall(userInfo.Phone)}>
                                            </i>
                                        )}

                                        <a href={`tencent://message/?uin=${userInfo.QQ}&Site=Sambow&Menu=yes`}>
                                            <i style={{fontSize: 24}} className="iconfont icon-QQ d-inline-block color-purple cursor-pointer ml-10">
                                            </i>
                                        </a>
                                    </div>
                                    
                                </Col>
                                <Col span={16}>
                                    {enableEdit && <FormItem label="备注名" labelCol={{span: 8}} wrapperCol={{span: 16}} className="form-item__zeromb">
                                        {getFieldDecorator('editCallName', {
                                            rules: [
                                                {
                                                    pattern: /^[\u4e00-\u9fa5a-zA-Z]+$/,
                                                    message: '姓名必须为中文或英文字符'
                                                }
                                            ]
                                        })(<Input type="text" onBlur={this.handleBlurSave.bind(this)} maxLength="6"
                                                style={{
                                                    border: '1px solid #108ee9',
                                                    borderRadius: '4px'
                                                }}
                                                placeholder="备注名"/>)}
                                        </FormItem>
                                    }
                                </Col>
                            </Row>
                        </Col>
                        <Col span={24} className="mt-14">
                          <Row gutter={8}>
                              <Col span={8}>
                                <FormItem label="民族" className="form-item__zeromb flexible-form-item">
                                   
                                        {getFieldDecorator('Nation', {
                                             initialValue: userInfo.Nation
                                        })(<Input disabled={true} type="text" maxLength="6"
                                            placeholder="民族"/>)}
                                </FormItem>
                              </Col>
                              <Col span={8}>
                                {userInfo.IDCardCert && <FormItem label="性别" className="form-item__zeromb flexible-form-item">
                                    <Input type="text" readOnly={true}
                                        value={userInfo.Gender === 0 ? '未知' : (userInfo.Gender === 1 ? '男' : (userInfo.Gender === 2 ? '女' : '-'))}/>
                                </FormItem>}
                                {enableEdit && !userInfo.IDCardCert &&
                                <FormItem label="性别" className="form-item__zeromb flexible-form-item">
                                    <Select
                                            value={this.props.editGender ? this.props.editGender.toString() : '0'}
                                            onChange={this.handleChangeEditGender.bind(this)}
                                            style={{border: '1px solid #108ee9', borderRadius: '4px'}} placeholder="性别">
                                        <Option value="0">未知</Option>
                                        <Option value="1">男</Option>
                                        <Option value="2">女</Option>
                                    </Select>
                                </FormItem>}
                              </Col>
                              <Col span={8}>
                                {userInfo.IDCardCert && <FormItem label="年龄" className="form-item__zeromb flexible-form-item">
                                    <Input readOnly value={userInfo.Age} style={{width: '100%'}} />
                                </FormItem>}
                                {enableEdit && !userInfo.IDCardCert &&
                                <FormItem label="年龄" className="form-item__zeromb flexible-form-item">
                                    {getFieldDecorator('editAge', {
                                        rules: []
                                    })(<InputNumber onBlur={this.handleBlurSave.bind(this)}
                                                    style={{border: '1px solid #108ee9', borderRadius: '4px', width: '100%'}}/>)}
                                </FormItem>}
                              </Col>
                          </Row>
                        </Col>
                        
                        <Col span={0}>
                            {enableEdit && <FormItem label="QQ" labelCol={{span: 7}} wrapperCol={{span: 17}} className="form-item__zeromb">
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
                        <Col span={0}>
                            {enableEdit && <FormItem label="微信" labelCol={{span: 7}} wrapperCol={{span: 17}} className="form-item__zeromb">
                                {getFieldDecorator('editWeChat', {
                                    rules: [
                                    ]
                                })(<Input type="text" onBlur={this.handleBlurSave.bind(this)}
                                          style={{border: '1px solid #108ee9', borderRadius: '4px'}}
                                          placeholder="微信号"/>)}
                            </FormItem>}
                        </Col>                        
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