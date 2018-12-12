import React from 'react';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import openDialog from 'ACTION/Dialog/openDialog';
import helpMemberApply from 'ACTION/Broker/MemberDetail/helpMemberApply';
import createMemberApply from 'ACTION/Broker/MemberDetail/createMemberApply';
import getMemberEstimateApplyList from 'ACTION/Broker/MemberDetail/getMemberEstimateApplyList';
import moment from 'moment';
import AutoCompleteSelect from 'COMPONENT/AutoCompleteSelect';
import { Button, Icon, Row, Col, Modal, message, Table, Select, Card, Form, Input, Collapse, DatePicker, Cascader, Tag } from 'antd';

const { TextArea } = Input;
const FormItem = Form.Item;
const { Option } = Select;
const Panel = Collapse.Panel;
const { Column, ColumnGroup } = Table;
const STATE_NAME = 'state_broker_member_detail_process';
class BlockCreateApply extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            showRecruitList: false,
            showStoreList: false
        };
    }

    componentWillReceiveProps(nextProps) {

    }

    handleCreateNormalApply() {
        this.props.form.validateFieldsAndScroll(['applyContactContent', 'applyRecruitName', 'applyStoreName', 'applySignTime'], (errors, values) => {
            if (!errors) {
                // let now = new Date();
                // let tomorrow = new Date(now.getFullYear(), now.getMonth(), (now.getDate() + 1), 0, 0, 0);
                // let hubRequired = this.props.applySignTime.value ? new Date(this.props.applySignTime.value.format('YYYY-MM-DD 00:00:00')).getTime() <= tomorrow.getTime() : false;
                // if (hubRequired && !(this.props.applyStoreName && this.props.applyStoreName.value && this.props.applyStoreName.value.value && parseInt(this.props.applyStoreName.value.value, 10))) {
                //     message.error('签到日期为今日或明日时，签到地点必选');
                //     return false;
                // }
                if (!this.props.applyContactContent.value || this.props.applyContactContent.value.length < 5) {
                    message.error('联系记录不能少于5个字');
                    return false;
                }
                if (this.props.currentProcessStep === 'normalApply') {
                    helpMemberApply({
                        UserID: this.props.userId,
                        Content: this.props.applyContactContent.value,
                        RecruitID: this.props.applyRecruitName && this.props.applyRecruitName.value ? parseInt(this.props.applyRecruitName.value.value, 10) : '',
                        GatherDepartID: (this.props.applyStoreName && this.props.applyStoreName.value) ? parseInt(this.props.applyStoreName.value.value, 10) : 0,
                        SignTime: this.props.applySignTime.value.format('YYYY-MM-DD 00:00:00'),
                        Type: 2,
                        UserStatus: 0,
                        Name: this.props.userName,
                        Phone: this.props.userPhone
                    });
                }
                if (this.props.currentProcessStep === 'processApply') {

                    createMemberApply({
                        UserID: this.props.userId,
                        Content: this.props.applyContactContent.value,
                        RecruitID: this.props.applyRecruitName && this.props.applyRecruitName.value ? parseInt(this.props.applyRecruitName.value.value, 10) : '',
                        GatherDepartID: (this.props.applyStoreName && this.props.applyStoreName.value) ? parseInt(this.props.applyStoreName.value.value, 10) : 0,
                        SignTime: this.props.applySignTime.value.format('YYYY-MM-DD 00:00:00'),
                        Type: this.props.currentProcessItem ? this.props.currentProcessItem.currentProcessItem || 2 : 2,
                        // UserStatus: this.props.currentProcessItem.Status,
                        UserStatus: 0,
                        Name: this.props.userName,
                        Phone: this.props.userPhone,
                        MsgFlowID: this.props.currentProcessItem ? this.props.currentProcessItem.MsgFlowID || 0 : 0,
                        SourceKeyID: this.props.currentProcessItem ? this.props.currentProcessItem.SourceKeyID || 0 : 0
                    });
                }
            }
        });
    }

    handleInputChange(e, paramKey) {
        let temp = {};
        temp[paramKey] = e.target.value;
        if (paramKey === 'applySignTime') {
            let c = new Date(e.target.value);
            temp[paramKey] = e.target.value ? new Date(c.getFullYear(), c.getMonth(), c.getDate(), 0, 0, 0) : '';
            let now = new Date();
            let today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
            if (temp[paramKey] === '') {
                message.warning('签到时间必选');
                return false;
            }
            if (temp[paramKey].getTime() < today.getTime()) {
                message.warning('签到时间不能早于今天');
                return false;
            }
        }
        setParams(STATE_NAME, temp);
    }

    matchRecruit(key, array) {
        let result = [];
        if (key) {
            for (let i = 0; i < array.length; i++) {
                if (escape(array[i].RecruitName).match(escape(key)) || escape(key).match(escape(array[i].RecruitName))) {
                    result.push(array[i]);
                }
            }
        }
        return result;
    }

    matchStore(key, array) {
        let result = [];
        if (key) {
            for (let i = 0; i < array.length; i++) {
                if (escape(array[i].HubName).match(escape(key)) || escape(key).match(escape(array[i].HubName))) {
                    result.push(array[i]);
                }
            }
        }
        return result;
    }

    handleSelectRecruit(item) {
        setParams(STATE_NAME, {
            applyRecruitId: item.RecruitID,
            applyRecruitName: item.RecruitName
        });
        this.setState({
            showRecruitList: false
        });
    }

    handleSelectStore(item) {
        setParams(STATE_NAME, {
            applyStoreId: item.HubID,
            applyStoreName: item.HubName
        });
        this.setState({
            showStoreList: false
        });
    }

    handleRecruitBlur(e) {
        if (!e.target.value) {
            setParams(STATE_NAME, {
                applyRecruitId: '',
                applyRecruitName: ''
            });
        }
    }

    handleStoreBlur(e) {
        if (!e.target.value) {
            setParams(STATE_NAME, {
                applyStoreId: '',
                applyStoreName: ''
            });
        }
    }

    handleFocus(value) {
        if (value === 1) {
            this.oldRecruitName = this.props.applyRecruitName;
            this.setState({
                showRecruitList: true
            });
        }
        if (value === 2) {
            this.setState({
                showStoreList: true
            });
        }
    }

    handleCancel() {
        setParams(STATE_NAME, {
            currentProcessStep: '',
            applyStoreId: '',
            applyStoreName: '',
            applyRecruitId: '',
            applyRecruitName: '',
            applyContactContent: ''
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        let storeList = this.matchStore(this.props.applyStoreName, this.props.storeList.storeList);
        let recruitList = this.matchRecruit(this.props.applyRecruitName, this.props.recruitList.recruitList);
        return (
            <Row>
                <Col span={12}>
                    <FormItem label="报名企业" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                        {getFieldDecorator('applyRecruitName', {
                            rules: [
                                {
                                    required: true,
                                    message: '报名企业必选'
                                },
                                {
                                    validator: (rule, value, cb) => {
                                        if (value && !value.value) {
                                            cb('报名企业必选');
                                        }
                                        cb();
                                    }
                                }
                            ]
                        })(<AutoCompleteSelect allowClear={true} optionsData={{ valueKey: 'RecruitID', textKey: 'RecruitName', dataArray: this.props.recruitList.recruitList }} />)}
                    </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem label="签到时间" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                        {getFieldDecorator('applySignTime', {
                            rules: [
                                {
                                    required: true,
                                    message: '签到时间必选'
                                }
                            ],
                            initialValue: null
                        })(<DatePicker disabledDate={function (current) {
                            let now = new Date();
                            return current && current.valueOf() < new Date(now.getFullYear(), now.getMonth(), (now.getDate()), 0, 0, 0);
                        }} />)}
                    </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem label="签到地点" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                        {getFieldDecorator('applyStoreName', {
                            rules: [
                            ]
                        })(<AutoCompleteSelect allowClear={true} optionsData={{ valueKey: 'HubID', textKey: 'HubName', dataArray: this.props.storeList.storeList }} />)}
                    </FormItem>
                </Col>
                <Col span={24}>
                    <FormItem label="联系记录" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                        {getFieldDecorator('applyContactContent', {
                            rules: [
                                {
                                    required: true,
                                    message: '联系记录必填'
                                },
                                {
                                    validator: function (rule, value, cb) {
                                        if (!value || !value.length || value.length < 5) {
                                            cb('联系内容不能少于5个字');
                                        }
                                        cb();
                                    }
                                }
                            ]
                        })(<TextArea rows={3} placeholder="请输入联系记录，最少5个字" style={{ resize: 'none' }} />)}
                    </FormItem>
                </Col>
                <Col span={24} className="text-center">
                    <Button htmlType="button" onClick={() => this.handleCancel()}>取消</Button>
                    <Button htmlType="button" className="ml-8" type="primary" onClick={() => this.handleCreateNormalApply()}>保存</Button>
                </Col>
            </Row>
        );
    }
}

export default Form.create({
    mapPropsToFields(props) {
        return {
            applySignTime: props.applySignTime,
            applyRecruitName: props.applyRecruitName,
            applyStoreName: props.applyStoreName,
            applyContactContent: props.applyContactContent
        };
    },
    onFieldsChange(props, fields) {
        setParams(STATE_NAME, fields);
    }
})(BlockCreateApply);