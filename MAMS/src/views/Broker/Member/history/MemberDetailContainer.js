import React from 'react';
import BlockDetailInfo from './BlockDetailInfo';
import BlockDetailAccount from './BlockDetailAccount';
import BlockDetailFollow from './BlockDetailFollow';
import BlockDetailRecommend from './BlockDetailRecommend';
import BlockDetailWork from './BlockDetailWork';
import BlockStatusRecord from './BlockStatusRecord';
import BlockDetailProcess from './BlockDetailProcess';
import BlockMemberTags from './BlockMemberTags';
import openDialog from 'ACTION/Dialog/openDialog';
import setParams from 'ACTION/setParams';
import resetState from 'ACTION/resetState';
import setFetchStatus from 'ACTION/setFetchStatus';
import getMemberDetailInfo from 'ACTION/Broker/MemberDetail/getMemberDetailInfo';
import setMemberAbnormal from "ACTION/Broker/MemberDetail/setMemberAbnormal";
import setMemberBanPost from "ACTION/Broker/MemberDetail/setMemberBanPost";
import getMemberAlarmList from 'ACTION/Broker/MemberDetail/getMemberAlarmList';
import brokerCallBack from 'ACTION/Broker/MemberDetail/brokerCallBack';
import deleteAlarm from 'ACTION/Broker/MemberDetail/deleteAlarm';
import createAlarm from 'ACTION/Broker/MemberDetail/createAlarm';

import {
    Menu,
    Dropdown,
    Button,
    Icon,
    Row,
    Col,
    Modal,
    message,
    Table,
    Select,
    Card,
    Form,
    Input,
    Collapse,
    DatePicker,
    Cascader,
    Tag
} from 'antd';

const {TextArea} = Input;
const FormItem = Form.Item;
const {Option} = Select;
const Panel = Collapse.Panel;
const {Column, ColumnGroup} = Table;

const STATE_NAME = 'state_broker_detail_member_operate';
const STATE_NAME_ALARM = 'state_broker_member_detail_alarm_clock';

class MemberDetailContainer extends React.PureComponent {
    constructor(props) { 
        super(props);
        this.state = {
            showToggle: false
        };
    }

    componentWillMount() {
        if (this.props.location.lastKey !== this.props.location.key && !(this.props.location.state && this.props.location.state.clickTab)) {
            getMemberDetailInfo({
                UserID: parseInt(this.props.router.params.memberId, 10)
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        // 交互体验优化，若认证会员tab标签未显示真实姓名，替换为真实姓名
        if (nextProps.detailInfo.getMemberDetailInfoFetch.status == 'success' && this.props.detailInfo.getMemberDetailInfoFetch.status != 'success') {
            let realName = (nextProps.detailInfo.userInfo || {}).Name;
            if (realName) {
                let tab = nextProps.tabList.find((item) => item.id == '/broker/member/detail/' + this.props.router.params.memberId);
                console.log(tab.name.replace('会员详情-', ''));
                if (tab && tab.name && tab.name.replace('会员详情-', '') != realName) {
                    tab.name = '会员详情-' + realName;
                    setParams('state_tabPage', [].concat(nextProps.tabList));
                }
            }
        }
        if (nextProps.detailOperate.setMemberAbnormalFetch.status === 'success') {
            message.success('标记异常申请已提交');
            setFetchStatus(STATE_NAME, 'setMemberAbnormalFetch', 'close');
            this.setState({
                showModal: 0
            });
        }
        if (nextProps.detailOperate.setMemberAbnormalFetch.status === 'error') {
            Modal.error({
                title: window.errorTitle.normal,
                content: nextProps.detailOperate.setMemberAbnormalFetch.response.Desc
            });
            setFetchStatus(STATE_NAME, 'setMemberAbnormalFetch', 'close');
        }
        if (nextProps.detailOperate.setMemberBanPostFetch.status === 'success') {
            message.success('设置禁言申请已提交');
            setFetchStatus(STATE_NAME, 'setMemberBanPostFetch', 'close');
            this.setState({
                showModal: 0
            });
        }
        if (nextProps.detailOperate.setMemberBanPostFetch.status === 'error') {
            Modal.error({
                title: window.errorTitle.normal,
                content: nextProps.detailOperate.setMemberBanPostFetch.response.Desc
            });
            setFetchStatus(STATE_NAME, 'setMemberBanPostFetch', 'close');
        }
        if (nextProps.alarmClock.deleteAlarmFetch.status === 'success') {
            setFetchStatus(STATE_NAME_ALARM, 'deleteAlarmFetch', 'close');
            message.success('删除成功');
            getMemberAlarmList({
                UserID: parseInt(this.props.router.params.memberId, 10)
            });
        }
        if (nextProps.alarmClock.deleteAlarmFetch.status === 'error') {
            setFetchStatus(STATE_NAME_ALARM, 'deleteAlarmFetch', 'close');
            Modal.error({
                title: window.errorTitle.normal,
                content: nextProps.alarmClock.deleteAlarmFetch.response.Desc
            });
        }
        if (nextProps.alarmClock.createAlarmFetch.status === 'success') {
            setFetchStatus(STATE_NAME_ALARM, 'createAlarmFetch', 'close');
            message.success('添加闹钟提醒成功');
            setParams(STATE_NAME_ALARM, {
                showCreateBox: false,
                createAlarmDate: '',
                createAlarmTime: '',
                createAlarmContent: ''
            });
            getMemberAlarmList({
                UserID: parseInt(this.props.router.params.memberId, 10)
            });
        }
        if (nextProps.alarmClock.createAlarmFetch.status === 'error') {
            setFetchStatus(STATE_NAME_ALARM, 'createAlarmFetch', 'close');
            Modal.error({
                title: window.errorTitle.normal,
                content: nextProps.alarmClock.createAlarmFetch.response.Desc
            });
        }
    }

    handleShowToggleMenu() {
        this.setState({
            showToggle: !this.state.showToggle
        });
    }

    handleShowModal(num) {
        this.setState({
            showModal: num,
            showToggle: false
        });
    }

    handleCloseModal(item) {
        if (item === 3) {
            setParams(STATE_NAME_ALARM, {
                showAlarmList: false
            });
        }
        this.setState({
            showModal: 0
        });
    }

    handleShowClock() {
        getMemberAlarmList({
            UserID: parseInt(this.props.router.params.memberId, 10)
        });
        setParams(STATE_NAME_ALARM, {
            showAlarmList: true
        });
    }

    handleBrokerCall() {
        brokerCallBack({
            UserID: parseInt(this.props.router.params.memberId, 10)
        });
    }

    handleDeleteAlarm(item) {
        // openDialog({
        //     id: 'confirmDeleteAlarm',
        //     type: 'confirm',
        //     theme: 'danger',
        //     title: '删除警告',
        //     message: '确定要删除该闹钟提醒?',
        //     afterCloseCall: (type) => {
        //         if (type === 'ok') {
        //             deleteAlarm({
        //                 ReminderIDList: [item.ID]
        //             });
        //         }
        //     }
        // });
        deleteAlarm({
            ReminderIDList: [item.ID]
        });
    }

    handleCtrlAlarmCreateBox(value) {
        if (this.props.alarmClock.alarmClockList && this.props.alarmClock.alarmClockList.length >= 5) {
            message.warning('一个会员最多设置5个闹钟');
            return false;
        }
        setParams(STATE_NAME_ALARM, {
            showCreateBox: value,
            createAlarmDate: {},
            createAlarmTime: '',
            createAlarmContent: {}
        });
    }

    handleAlarmInputChange(e, paramKey) {
        let temp = {};
        temp[paramKey] = e.target.value;
        setParams(STATE_NAME_ALARM, temp);
    }

    handleDoCreateAlarm() {
        this.props.form.validateFieldsAndScroll(['createAlarmDate', 'createAlarmContent'], (errors, values) => {
            if (!errors) {
                createAlarm({
                    UserID: parseInt(this.props.router.params.memberId, 10),
                    RemindTime: this.props.alarmClock.createAlarmDate.value.format('YYYY-MM-DD HH:mm:ss'),
                    Content: this.props.alarmClock.createAlarmContent.value
                });
            }
        });
    }

    handleCallQQ() {
        if (this.props.detailInfo.userInfo.QQ) {
            window.open('http://wpa.qq.com/msgrd?v=3&uin=' + this.props.detailInfo.userInfo.QQ + '&site=qq&menu=yes', '_blank', "toolbar=yes, location=yes, directories=no, status=no, menubar=yes, scrollbars=yes, resizable=no, copyhistory=yes, width=600, height=400");
        } else {
            message.warning('该会员还没有设置QQ号，请通过其他方式沟通');
        }
    }

    handleModalAbnormalOk() {
        this.props.form.validateFieldsAndScroll(['abnormalReason'], (errors, values) => {
            if (!errors) {
                setMemberAbnormal({
                    UserID: parseInt(this.props.router.params.memberId, 10),
                    Reason: this.props.detailOperate.abnormalReason.value
                });
            }
        });
    }

    handleModalAbnormalCancel() {
        this.setState({
            showModal: 0
        });
        setParams(STATE_NAME, {
            abnormalReason: ''
        });
    }

    handleModalBanpostOk() {
        this.props.form.validateFieldsAndScroll(['banPostReason'], (errors, values) => {
            if (!errors) {
                setMemberBanPost({
                    UserID: parseInt(this.props.router.params.memberId, 10),
                    Reason: this.props.detailOperate.banPostReason.value
                });
            }
        });
    }

    handleModalBanpostCancel() {
        this.setState({
            showModal: 0
        });
        setParams(STATE_NAME, {
            banPostReason: ''
        });
    }

    handleModalAlarmOk() {

    }

    handleModalAlarmCancel() {
        this.setState({
            showModal: 0
        });
        setParams(STATE_NAME_ALARM, {
            showAlarmList: false,
            showCreateBox: false,
            createAlarmDate: {},
            createAlarmTime: '',
            createAlarmContent: {}
        });
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <div>
                <div className="ivy-page-title">
                    {this.props.detailInfo.userInfo.IDCardCert &&
                    <span className="iconfont icon-iconheji color-warning mr-8"
                          style={{fontSize: '24px'}}/>}
                    {this.props.detailInfo.userInfo.IsWeekPay && <span
                        className="iconfont icon-zhou color-primary mr-8"
                        style={{fontSize: '24px'}}/>}
                    {this.props.detailInfo.userInfo.IsAbnormal && <span
                        className="iconfont icon-heimingdan1 mr-8"
                        style={{fontSize: '24px', color: '#333'}}/>}
                    <h1>{(this.props.detailInfo.userInfo.Name || this.props.detailInfo.userInfo.CallName || this.props.detailInfo.userInfo.NickName || '') + '-' + (this.props.detailInfo.userInfo && this.props.detailInfo.userInfo.Phone && this.props.detailInfo.userInfo.Phone.length >= 11 ? this.props.detailInfo.userInfo.Phone.substr(0, 3) + this.props.detailInfo.userInfo.Phone.substr(3, 4) + this.props.detailInfo.userInfo.Phone.substr(7, 4) : '')}</h1>
                    <Dropdown size="large" overlay={
                        <Menu>
                            <Menu.Item>
                                <a href="javascript:void(0)" onClick={() => this.handleShowModal(1)}>设置为异常会员</a>
                            </Menu.Item>
                            <Menu.Item>
                                <a href="javascript:void(0)" onClick={() => this.handleShowModal(2)}>设置禁言</a>
                            </Menu.Item>
                        </Menu>
                    }>
                        <a className="ant-dropdown-link" href="javascript:void(0)">
                            <Icon type="caret-down" className="font-18 ml-8" style={{color: '#ccc'}}/>
                        </a>
                    </Dropdown>
                    <div style={{display: 'inline-block'}}>
                        {new Date().getMonth() === new Date(this.props.detailInfo.userInfo.BirthDay).getMonth() && new Date().getDate() === new Date(this.props.detailInfo.userInfo.BirthDay).getDate() &&
                        <div>
                                <span className="iconfont icon-wannianli-07" style={{
                                    fontSize: '28px',
                                    color: 'rgb(255, 202, 134)',
                                    marginLeft: '100px'
                                }}></span>
                            <span style={{
                                fontSize: '18px',
                                color: 'rgb(255, 195, 134)',
                                marginLeft: '10px'
                            }}>今天是Ta的{new Date().getFullYear() - new Date(this.props.detailInfo.userInfo.BirthDay).getFullYear()}岁生日</span>
                        </div>
                        }
                    </div>
                    <div className="float-right">
                        <i className="iconfont icon-dianhua d-inline-block color-blue mr-8"
                           onClick={() => this.handleBrokerCall()}></i>
                        <i className="iconfont icon-QQ d-inline-block color-purple mr-8"
                           onClick={this.handleCallQQ.bind(this)}></i>
                        <i className="iconfont icon-naoling inline-block color-warning mr-8"
                           onClick={() => this.handleShowClock()}></i>
                    </div>
                </div>
                <div className="container-fluid mt-16">
                    <Row>
                        <BlockDetailInfo {...this.props.detailInfo} />
                    </Row>
                    <Row className="mt-16">
                        <BlockDetailProcess {...this.props.processInfo}
                                            userId={parseInt(this.props.router.params.memberId, 10)}
                                            userName={this.props.detailInfo.userInfo.Name || this.props.detailInfo.userInfo.NickName || this.props.detailInfo.userInfo.CallName}
                                            userPhone={this.props.detailInfo.userInfo.Phone}
                                            userStatus={this.props.detailInfo.userInfo.Status}
                                            recruitList={this.props.recruitList} storeList={this.props.storeList}/>
                    </Row>
                    <Row className="mt-16">
                        <BlockStatusRecord {...this.props.statusRecord}
                                           userId={parseInt(this.props.router.params.memberId, 10)}/>
                    </Row>
                    {/* <Row className="mt-16">
                        <BlockDetailAccount {...this.props.accountInfo}
                            bankCardNum={this.props.detailInfo.userInfo.BankCardNum}
                            userId={parseInt(this.props.router.params.memberId, 10)} />
                    </Row> */}
                    <Row className="mt-16">
                        <BlockDetailFollow {...this.props.followedList}
                                           userId={parseInt(this.props.router.params.memberId, 10)}/>
                    </Row>
                    <Row className="mt-16">
                        <BlockMemberTags {...this.props.memberTags}
                                         userId={parseInt(this.props.router.params.memberId, 10)}
                                         userPhone={this.props.detailInfo.userInfo.Phone}/>
                    </Row>
                    <Row className="mt-16">
                        <BlockDetailRecommend {...this.props.recommendList}
                                              userId={parseInt(this.props.router.params.memberId, 10)}
                                              userName={this.props.detailInfo.userInfo.Name || this.props.detailInfo.userInfo.NickName || this.props.detailInfo.userInfo.CallName}
                                              userPhone={this.props.detailInfo.userInfo.Phone}/>
                    </Row>
                    <Row className="mt-16">
                        <BlockDetailWork {...this.props.workList}
                                         userId={parseInt(this.props.router.params.memberId, 10)}/>
                    </Row>
                    <Modal
                        title="申请标记异常"
                        visible={this.state.showModal === 1}
                        onOk={this.handleModalAbnormalOk.bind(this)}
                        onCancel={this.handleModalAbnormalCancel.bind(this)}>
                        <Row>
                            <Col span={24}>
                                <FormItem label="异常原因" labelCol={{span: 4}} wrapperCol={{span: 20}}>
                                    {getFieldDecorator('abnormalReason', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '异常原因必填'
                                            }
                                        ]
                                    })(<TextArea rows={4} placeholder="请输入异常原因" style={{resize: 'none'}}/>)}
                                </FormItem>
                            </Col>
                        </Row>
                    </Modal>
                    <Modal
                        title="申请禁言"
                        visible={this.state.showModal === 2}
                        onOk={this.handleModalBanpostOk.bind(this)}
                        onCancel={this.handleModalBanpostCancel.bind(this)}>
                        <Row>
                            <Col span={24}>
                                <FormItem label="禁言原因" labelCol={{span: 4}} wrapperCol={{span: 20}}>
                                    {getFieldDecorator('banPostReason', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '禁言原因必填'
                                            }
                                        ]
                                    })(<TextArea rows={4} placeholder="请输入禁言原因" style={{resize: 'none'}}/>)}
                                </FormItem>
                            </Col>
                        </Row>
                    </Modal>
                    <Modal
                        title="闹钟（最多设置5个闹钟）"
                        visible={this.props.alarmClock.showAlarmList}
                        footer={null}
                        onOk={this.handleModalAlarmOk.bind(this)}
                        onCancel={this.handleModalAlarmCancel.bind(this)}>
                        {!this.props.alarmClock.showCreateBox && <Row className="mb-8">
                            <Button type="primary" htmlType="button"
                                    onClick={() => this.handleCtrlAlarmCreateBox(true)}>+新建提醒</Button>
                        </Row>}
                        {this.props.alarmClock.showCreateBox &&
                        <Row>
                            <FormItem label="提醒时间" labelCol={{span: 4}} wrapperCol={{span: 20}}>
                                {getFieldDecorator('createAlarmDate', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '提醒时间必填'
                                        }
                                    ]
                                })(<DatePicker showTime
                                               format="YYYY-MM-DD HH:mm:ss"
                                               disabledDate={(current) => {
                                                   let now = new Date();
                                                   return current && new Date(current.format('YYYY-MM-DD 00:00:00')).getTime() < new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0).getTime();
                                               }}
                                               disabledTime={(current) => {
                                                   let now = new Date();
                                                   return current && new Date(current.format('YYYY-MM-DD 00:00:00')).getTime() < now.getTime() - 100;
                                               }}/>)}
                            </FormItem>
                            <FormItem label="提醒内容" labelCol={{span: 4}} wrapperCol={{span: 20}}>
                                {getFieldDecorator('createAlarmContent', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '提醒内容必填'
                                        }
                                    ]
                                })(<Input type="text" placeholder="请输入提醒内容"/>)}
                            </FormItem>
                            <Col span={24} className="mt-8 mb-8 text-right">
                                <Button htmlType="button"
                                        onClick={() => this.handleCtrlAlarmCreateBox(false)}>取消</Button>
                                <Button type="primary" className="ml-8" htmlType="button"
                                        onClick={() => this.handleDoCreateAlarm()}>保存</Button>
                            </Col>
                        </Row>
                        }
                        <Row>
                            <Table
                                scroll={{y: 440}}
                                rowKey={record => record.ID.toString()}
                                dataSource={this.props.alarmClock.alarmClockList}
                                pagination={false}
                                loading={false}
                                size="middle"
                                bordered>
                                <Column
                                    title="提醒时间"
                                    dataIndex="RemindTime"
                                    width={150}
                                />
                                <Column
                                    title="提醒内容"
                                    dataIndex="Content"
                                />
                                <Column
                                    title="操作"
                                    dataIndex="operate"
                                    width={150}
                                    render={(text, record, index) => {
                                        return (
                                            <Button htmlType="button" type="danger"
                                                    onClick={() => this.handleDeleteAlarm(record)}>删除
                                            </Button>
                                        );
                                    }}
                                />
                            </Table>
                        </Row>
                    </Modal>
                    {this.props.alarmClock.showAlarmList && <div className="ivy-modal">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{this.props.detailInfo.userInfo.Name || this.props.detailInfo.userInfo.NickName || this.props.detailInfo.userInfo.CallName}的闹钟管理
                                    <span
                                        className="text-secondary font-weight-normal"
                                        style={{fontSize: '14px'}}>（最多设置5个闹钟）</span></h5>
                                <i className="iconfont icon-guanbi1 btn-close"
                                   onClick={() => this.handleCloseModal(3)}></i>
                            </div>
                            <div className="modal-body">
                                <button className="btn btn-sm btn-outline-info"
                                        onClick={() => this.handleCtrlAlarmCreateBox(true)}>+新建提醒
                                </button>
                                {this.props.alarmClock.showCreateBox && <div className="row mt-2 mb-2">
                                    <div className="container-fluid">
                                        <div className="card w-100">
                                            <div className="card-body">
                                                <div className="form-group">
                                                    <label htmlFor="">提醒时间</label>
                                                    <input type="date" className="form-control d-inline-block w-50"
                                                           value={this.props.alarmClock.createAlarmDate}
                                                           onChange={(e) => this.handleAlarmInputChange(e, 'createAlarmDate')}/>
                                                    <input type="time" className="form-control d-inline-block w-25"
                                                           value={this.props.alarmClock.createAlarmTime}
                                                           onChange={(e) => this.handleAlarmInputChange(e, 'createAlarmTime')}/>
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="">提醒内容</label>
                                                    <input type="text" className="form-control" placeholder="请输入提醒内容"
                                                           value={this.props.alarmClock.createAlarmContent}
                                                           onChange={(e) => this.handleAlarmInputChange(e, 'createAlarmContent')}/>
                                                </div>
                                                <button className="btn btn-secondary btn-sm"
                                                        onClick={() => this.handleCtrlAlarmCreateBox(false)}>取消
                                                </button>
                                                <button className="btn btn-info btn-sm"
                                                        onClick={() => this.handleDoCreateAlarm()}>保存
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>}
                                <table className="table table-bordered table-hover mt-2">
                                    <thead>
                                    <tr>
                                        <th>提醒时间</th>
                                        <th>提醒内容</th>
                                        <th>操作</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        this.props.alarmClock.alarmClockList.map((item, i) => {
                                            return (
                                                <tr key={i}>
                                                    <td>{item.RemindTime}</td>
                                                    <td>{item.Content}</td>
                                                    <td>
                                                        <button className="btn btn-sm btn-danger" type="button"
                                                                onClick={() => this.handleDeleteAlarm(item)}>删除
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>}
                </div>
            </div>
        )
            ;
    }
}

export default Form.create({
    mapPropsToFields(props) {
        return {
            abnormalReason: props.detailOperate.abnormalReason,
            banPostReason: props.detailOperate.banPostReason
        };
    },
    onFieldsChange(props, fields) {
        let temp1 = {};
        let temp2 = {};
        for (let k in fields) {
            if (k === 'createAlarmDate' || k === 'createAlarmContent') {
                temp1[k] = fields[k];
            } else {
                temp2[k] = fields[k];
            }
        }
        setParams(STATE_NAME, temp2);
        setParams(STATE_NAME_ALARM, temp1);
    }
})(MemberDetailContainer);