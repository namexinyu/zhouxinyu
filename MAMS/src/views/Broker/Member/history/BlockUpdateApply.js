import React from 'react';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import openDialog from 'ACTION/Dialog/openDialog';
import modifyMemberApply from 'ACTION/Broker/MemberDetail/modifyMemberApply';
import getMemberEstimateApplyList from 'ACTION/Broker/MemberDetail/getMemberEstimateApplyList';
import replyFeedback from 'ACTION/Broker/MemberDetail/replyFeedback';
import getMemberContactRecord from 'ACTION/Broker/MemberDetail/getMemberContactRecord';
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

    shouldComponentUpdate() {
        return true;
    }

    componentWillReceiveProps(nextProps) {
        // console.log(22222222222, nextProps);
        // if (nextProps.modifyMemberApplyFetch.status === 'success') {
        //     console.log(333333, this.props.updateContactContent, nextProps.updateContactContent);
        //     setParams(STATE_NAME, {
        //         currentProcessItem: '',
        //         updateContactContent: {
        //             value: ''
        //         }
        //     });
        // }
    }
    getMemberContactRecord(props) {
        getMemberContactRecord({
            UserID: props.userId,
            RecordIndex: props.contactIndex,
            RecordSize: props.contactPageSize,
            StartTime: new Date(props.contactStartTime).Format('yyyy-MM-dd hh:mm:ss'),
            EndTime: new Date(props.contactEndTime.getFullYear(), props.contactEndTime.getMonth(), props.contactEndTime.getDate() + 1, 0, 0, 0).Format('yyyy-MM-dd hh:mm:ss')
        });
    }

    handleModifyApplyInfo() {
        this.props.form.validateFieldsAndScroll(['updateContactContent', 'updateRecruitName', 'updateStoreName', 'updateSignTime'], (errors, values) => {
            if (!errors) {
                // let now = new Date();
                // let tomorrow = new Date(now.getFullYear(), now.getMonth(), (now.getDate() + 1), 0, 0, 0);
                // let hubRequired = this.props.updateSignTime.value ? new Date(this.props.updateSignTime.value.format('YYYY-MM-DD 00:00:00')).getTime() <= tomorrow.getTime() : false;
                // if (hubRequired && !(this.props.updateStoreName && this.props.updateStoreName.value && this.props.updateStoreName.value.value && parseInt(this.props.updateStoreName.value.value, 10))) {
                //     message.error('签到日期为今日或明日时，签到地点必选');
                //     return false;
                // }
                if (!this.props.updateContactContent.value || this.props.updateContactContent.value.length < 5) {
                    message.error('联系记录不能少于5个字');
                    return false;
                }
                modifyMemberApply({
                    UserID: this.props.userId,
                    UserPreOrderID: this.props.currentEstimateApply.UserPreOrderID,
                    Content: this.props.updateContactContent.value,
                    RecruitID: this.props.updateRecruitName && this.props.updateRecruitName.value ? parseInt(this.props.updateRecruitName.value.value, 10) : 0,
                    GatherDepartID: (this.props.updateStoreName && this.props.updateStoreName.value) ? parseInt(this.props.updateStoreName.value.value, 10) : 0,
                    SignTime: this.props.updateSignTime.value.format('YYYY-MM-DD 00:00:00'),
                    Type: this.props.currentProcessItem ? this.props.currentProcessItem.currentProcessItem || 2 : 2,
                    UserStatus: 0,
                    MsgFlowID: this.props.currentProcessItem ? this.props.currentProcessItem.MsgFlowID || 0 : 0
                    // SourceKeyID: this.props.currentProcessItem ? this.props.currentProcessItem.SourceKeyID || '' : ''
                });
                // if (this.props.currentProcessItem.Type === 8) {
                //     replyFeedback({
                //         UserID: this.props.userId,
                //         ReplyInfo: [{
                //             Content: this.props.updateContactContent,
                //             FeedbackID: this.props.currentProcessItem.MsgID,
                //             Type: this.props.currentProcessItem.Type,
                //             UserStatus: this.props.currentProcessItem.Status
                //         }]
                //     });
                // }
            }
        });

    }

    handleInputChange(e, paramKey) {
        let temp = {};
        temp[paramKey] = e.target.value;
        if (paramKey === 'updateSignTime') {
            let c = new Date(e.target.value);
            temp[paramKey] = new Date(c.getFullYear(), c.getMonth(), c.getDate(), 0, 0, 0);
            let now = new Date();
            let today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
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
            updateRecruitId: item.RecruitID,
            updateRecruitName: item.RecruitName
        });
        this.setState({
            showRecruitList: false
        });
    }

    handleSelectStore(item) {
        setParams(STATE_NAME, {
            updateStoreId: item.HubID,
            updateStoreName: item.HubName
        });
        this.setState({
            showStoreList: false
        });
    }

    handleRecruitBlur(e) {
        if (!e.target.value) {
            setParams(STATE_NAME, {
                updateRecruitId: '',
                updateRecruitName: ''
            });
        }
    }

    handleStoreBlur(e) {
        if (!e.target.value) {
            setParams(STATE_NAME, {
                updateStoreId: '',
                updateStoreName: ''
            });
        }
    }

    handleFocus(value) {
        if (value === 1) {
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

    handleSendBus() {
        if (new Date(this.props.currentEstimateApply.EstimatedTime).getTime() < new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1, 0, 0, 0).getTime()) {
            setParams(STATE_NAME, {
                currentProcessStep: 'sendBus',
                sendLocation: {
                    value: {
                        text: this.props.updateStoreName && this.props.updateStoreName.value && this.props.updateStoreName.value.text || '',
                        value: this.props.updateStoreName && this.props.updateStoreName.value && this.props.updateStoreName.value.value || ''
                    }
                }
            });
        } else {
            message.warning('签到时间为今天时，才允许派车');
        }

    }

    handleCloseRecord() {
        setParams(STATE_NAME, {
            showCloseConfirm: true
        });
    }

    componentDidMount() {
        if (!this.props.updateContactContent || !this.props.updateContactContent.value) {
            // document.getElementById('updateContactContent').value = '';
        }

    }
    componentDidUpdate() {
        if (!this.props.updateContactContent || !this.props.updateContactContent.value) {
            // document.getElementById('updateContactContent').value = '';
        }
    }
    handleChangeContact(e) {
        setParams(STATE_NAME, {
            updateContactContent: {
                value: e.target.value
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        let storeList = this.matchStore(this.props.updateStoreName, this.props.storeList.storeList);
        let recruitList = this.matchRecruit(this.props.updateRecruitName, this.props.recruitList.recruitList);
        return (
            <Row>
                <Col span={12}>
                    <FormItem label="报名企业" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                        {getFieldDecorator('updateRecruitName', {
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
                            ],
                            initialValue: this.props.updateRecruitName.value
                        })(<AutoCompleteSelect allowClear={true} optionsData={{ valueKey: 'RecruitID', textKey: 'RecruitName', dataArray: this.props.recruitList.recruitList }} />)}
                    </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem label="签到时间" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                        {getFieldDecorator('updateSignTime', {
                            rules: [
                                {
                                    required: true,
                                    message: '签到时间必选'
                                }
                            ],
                            initialValue: this.props.updateSignTime.value || null
                        })(<DatePicker disabledDate={function (current) {
                            let now = new Date();
                            return current && current.valueOf() < new Date(now.getFullYear(), now.getMonth(), (now.getDate()), 0, 0, 0);
                        }} />)}
                    </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem label="签到地点" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                        {getFieldDecorator('updateStoreName', {
                            rules: [],
                            initialValue: this.props.updateStoreName.value
                        })(<AutoCompleteSelect allowClear={true} optionsData={{ valueKey: 'HubID', textKey: 'HubName', dataArray: this.props.storeList.storeList }} />)}
                    </FormItem>
                </Col>
                <Col span={24}>
                    <FormItem label="联系记录" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                        <TextArea id="fuckContact" rows={3} value={this.props.updateContactContent.value} onChange={this.handleChangeContact.bind(this)} placeholder="请输入联系记录，最少5个字" style={{ resize: 'none' }} />
                        {/* {getFieldDecorator('updateContactContent', {
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
                        })(<TextArea id="fuckContact" rows={3} placeholder="请输入联系记录，最少5个字" style={{ resize: 'none' }} />)} */}
                    </FormItem>
                </Col>
                <Col span={24} className="text-center">
                    <Button htmlType="button" type="danger" onClick={() => this.handleCloseRecord()}>结案</Button>
                    <Button htmlType="button" className="ml-8" onClick={() => this.handleSendBus()}>派车</Button>
                    <Button htmlType="button" className="ml-8" type="primary" onClick={() => this.handleModifyApplyInfo()}>保存</Button>
                </Col>
            </Row>
        );
    }
}

export default Form.create({
    mapPropsToFields(props) {
        return {
            updateSignTime: props.updateSignTime,
            updateRecruitName: props.updateRecruitName,
            updateStoreName: props.updateStoreName,
            updateContactContent: props.updateContactContent
        };
    },
    onFieldsChange(props, fields) {
        setParams(STATE_NAME, fields);
    }
})(BlockCreateApply);
