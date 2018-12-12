import 'ASSET/less/pages/ivy-header.less';
import React from 'react';
import {Layout, Row, Col, Popover, message, Button, Card, Badge, Icon, Modal, notification} from 'antd';
import {browserHistory, Link} from 'react-router';
import AppSessionStorage from 'CONFIG/SessionStorage/AppSessionStorage';
import {goToLogin} from 'UTIL/HttpRequest/index';
import setParams from 'ACTION/setParams';
import LazyLoadMap from 'UTIL/BaiduMap/LazyLoadMap';
import getBrokerLevel from 'ACTION/Broker/TimingTask/getBrokerLevel';
import getNewPersonalRemindList from 'ACTION/Broker/TimingTask/getNewPersonalRemindList';
import getBrokerName from 'ACTION/Broker/Header/getBrokerName';
import {accountInformationGet, accountInformationSetStatus} from 'ACTION/Broker/Header/AccountInformation';
import getRemindCount from 'ACTION/Broker/TimingTask/getRemindCount';
import getResourceCount from 'ACTION/Broker/TimingTask/getResourceCount';
import getSystemMessageCount from 'ACTION/Broker/TimingTask/getSystemMessageCount';
import getWaitCount from 'ACTION/Broker/TimingTask/getWaitCount';
import getMessages from 'ACTION/Broker/TimingTask/getMessages';
import getExamCount from 'ACTION/Broker/TimingTask/getExamCount';
import getPersonalRemindCount from 'ACTION/Broker/TimingTask/getPersonalRemindCount';
import setFetchStatus from "ACTION/setFetchStatus";
import PersonalRemindTip from './PersonalRemindTip';
import LaborExamModal from '../Broker/Exam/blocks/LaborExam';
import FactoryExamModal from '../Broker/Exam/blocks/FactoryExam';
import messagemodal from 'ACTION/Common/Message/messagemodal';
import Eventlist from 'SERVICE/Broker/Message';
import ossConfig from 'CONFIG/ossConfig';
import Quick from "ACTION/Common/Message/quick";
import MemberDetailService from 'SERVICE/Broker/MemberDetailService';
import MessageService from 'SERVICE/Broker/Message';

const {Header} = Layout;
const IMG_PATH = ossConfig.getImgPath();

const STATE_NAME_ACCOUNT = 'state_business_header_accountInfo'; // store貌似没什么用，预留
const chNum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];

class PageHeader extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            ModalExamVisible: false,
            ModalFactoryVisible: false,
            showSalaryEntry: true,
            visibleTo: false,
            information: [],
            previewVisible: false,
            previewUrl: ''
        };
    }

    componentWillMount() {
        if (!this.props.loginAddress) {
            LazyLoadMap({needDraw: false}).then(() => {
                var a = document.createElement('div');
                a.style.display = 'none';
                a.id = 'allmap';
                document.body.appendChild(a);
                var map = new window.BMap.Map("allmap");

                function myFun(result) {
                    var cityName = result.name;
                    setParams('state_broker_header_accountInfo', {
                        loginAddress: cityName
                    });
                }

                var myCity = new window.BMap.LocalCity();
                myCity.get(myFun);
            }, () => {

            });
        }
        if (!window.BrokerTimingTask1 && window.env !== window.envs.dev) {
            // getRemindCount();
            // getResourceCount();
            // getSystemMessageCount();
            getWaitCount();
            window.BrokerTimingTask1 = setInterval(() => {
                // getRemindCount();
                // getResourceCount();
                // getSystemMessageCount();
                getWaitCount();
            }, 10000);
        }
        if (!window.BrokerTimingTask2) {
            getPersonalRemindCount();
            getNewPersonalRemindList();
            window.BrokerTimingTask2 = setInterval(() => {
                getPersonalRemindCount();
                getNewPersonalRemindList();
            }, 60000);
        }
        if (!window.BrokerTimingTask3) {
            getBrokerLevel();
            window.BrokerTimingTask3 = setInterval(() => {
                getBrokerLevel();
            }, 1800000);
        }
        if (!window.BrokerTimingTask4) {
            /*
            window.BrokerTimingTask4 = setInterval(() => {
                if (!this.props.accountInfo.ModalExamVisible && !this.props.accountInfo.ModalFactoryVisible) {
                    getExamCount();
                }
            }, 13000);
            */
        }

        if (!(this.props.brokerInfo.BrokerId && this.props.brokerInfo.BrokerId === this.props.loginInfo.LoginId)) {
            getBrokerName();
        }

        if (!window.BrokerTimingTask5) {
            getMessages({
                EmployeeID: AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('employeeId'),
                EmployeeType: AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('role')[0]
            });
            window.BrokerTimingTask5 = setInterval(() => {
                console.log('hello componentDidMount');
                
                if (AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('role')[0] == 'Broker') {
                    getMessages({
                        EmployeeID: AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('employeeId'),
                        EmployeeType: AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('role')[0]
                    });
                }
                
            }, 20000);
        }

    }

    componentDidMount() {
        // if (document.getElementById('message-notify')) {
        //     notification.config({
        //         getContainer: () => {
        //             return document.getElementById('message-notify');
        //         }
        //     });
        // }
            
          
    }

    componentWillReceiveProps(nextProps) {
        const {accountInformationSetStatusFetch, accountInformationGetFetch} = nextProps.accountInfo;
        if (accountInformationSetStatusFetch.status === 'success') {
            setFetchStatus('state_broker_header_accountInfo', 'accountInformationSetStatusFetch', 'close');
            message.success('状态更改成功');
            accountInformationGet();
        } else if (accountInformationSetStatusFetch.status === 'error') {
            setFetchStatus('state_broker_header_accountInfo', 'accountInformationSetStatusFetch', 'close');
            message.error('状态更改失败');
        }

        if (accountInformationGetFetch.status === 'error') {
            setFetchStatus('state_broker_header_accountInfo', 'accountInformationGetFetch', 'close');
            message.error('获取信息失败');
        }

        if (nextProps.getExamCountFetch && nextProps.getExamCountFetch.status === 'success') {
            if (!nextProps.accountInfo.ModalExamVisible && !nextProps.accountInfo.ModalFactoryVisible) {
                if (nextProps.CanExam && nextProps.ExamType === 1) {
                    this.showLaborExam();
                } else if (nextProps.CanExam && nextProps.ExamType === 2) {
                    this.showFactoryExam();
                } 
            }
            setFetchStatus('state_broker_timingTask', 'getExamCountFetch', 'close');
        }
        
        if (nextProps.getMessagesFetch.status === 'success') {
            setFetchStatus('state_broker_timingTask', 'getMessagesFetch', 'close');

            const NotifyInfo = (nextProps.getMessagesFetch.response.Data || {}).NotifyInfo || [];
            const computedNofifyInfo = NotifyInfo.filter(item => item.NotifyType === 5).reverse().concat(NotifyInfo.filter(item => item.NotifyType !== 5).reverse());

            if (NotifyInfo.length) {
                for (let index = 0; index < computedNofifyInfo.length; index++) {
                    const currentMessage = computedNofifyInfo[index] || {};
                    const key = `open${Date.now()}`;
                    
                    const btn = (
                        <Button type="primary" size="small" onClick={() => notification.close(key)}>知道了</Button>
                    );

                    const viewBtn = (
                        <a onClick={() => {
                            browserHistory.push({
                                pathname: 'broker/event-management/list',
                                state: {
                                    EventID: (JSON.parse(currentMessage.NewContext) || {}).EventID || 0
                                }
                            });
                            notification.close(key);
                        }}>查看详情</a>
                    );

                    notification.open({
                        message: this.renderMsgTitle(computedNofifyInfo, currentMessage),
                        description: <div className="message-notify__desc">{this.renderMessage(computedNofifyInfo, currentMessage)}</div>,
                        duration: 0,
                        btn: currentMessage.NotifyType === 5 ? viewBtn : btn,
                        className: 'message-notify',
                        style: {
                            zIndex: currentMessage.NotifyType === 5 ? this.incrementZIndex() : 0
                        },
                        key,
                        onClose: () => {
                            console.log('close');  
                        }
                    });
                }
            }
        }
    }

    incrementZIndex = (function() {
        var n = 1;
        return function() {
            return n++;
        };
    })()

    changePage(item) {
        if (this.props.location.pathname !== item.route) {
            browserHistory.push({
                pathname: item.route
            });
        }
    }

    handleSetWorkStatus() {
        const {WorkingStatus} = this.props.accountInfo;
        let status = WorkingStatus < 1 || WorkingStatus > 2 ? 1 : WorkingStatus;
        accountInformationSetStatus({
            WorkingStatus: Math.abs(status - 3)
        });
    }

    handleLogout() {
        AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.build();
        // if (window.loginTimeOutTask) clearInterval(window.loginTimeOutTask);
        goToLogin({}, true);
    }

    showLaborExam() {
        // this.setState({ModalExamVisible: true}); 
        setParams('state_broker_header_accountInfo', {ModalExamVisible: true, bPopup: true});
     }
 
     hideLaborExam() {
         setParams('state_broker_header_accountInfo', {ModalExamVisible: false});
         // this.setState({ModalExamVisible: false}); 
     }
 
     showFactoryExam() {
         setParams('state_broker_header_accountInfo', {ModalFactoryVisible: true, bPopup: true});
         // this.setState({ModalFactoryVisible: true}); 
     }
 
     hideFactoryExam() {
         setParams('state_broker_header_accountInfo', {ModalFactoryVisible: false});
         // this.setState({ModalFactoryVisible: false}); 
     }
    
     handleGoExam(RecruitType) {
         if (RecruitType === 1) {
             this.showLaborExam();
         }else{
             this.showFactoryExam();
         }
     }
     baby=()=> {
         const {
             messageBuffer
         } = this.props;
         if (messageBuffer.length) {
             const copyMessages = [...messageBuffer];
             copyMessages.shift();
             setParams('state_broker_timingTask', {
                 messageBuffer: copyMessages,
                 messageModalVisible: messageBuffer.length > 1 ? true : false
             });
         } else {
            setParams('state_broker_timingTask', {
                messageModalVisible: false
            });
         }
         
     }
     make=(a)=> {
         let go = {
            Content: JSON.parse(a['NewContext'])['UserMobile'],
            BrokerID: AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('employeeId')
         };
        Quick(go);
     }
     preview=(item)=> {
        this.setState({
          previewVisible: true,
          previewUrl: IMG_PATH + item
        });
    }

    handleBrokerCall = (phone) => {
        const brokerId = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('loginId');
        MemberDetailService.brokerCallBack({
            BrokerID: brokerId,
            Message: `${phone}`
        }).then((res) => {
            if (res.Code === 0) {
                message.success('号码已推送，请在手机上直接拨打');                
            } else {
                message.error(res.Desc || '号码推送失败，请稍后尝试！');
            }
        }).catch((err) => {
            message.error(err.Desc || '号码推送失败，请稍后尝试！');
        });
    }

    packMessageContent = (msg) => {
        const firstMsg = msg;
        const {
            NotifyType,
            OldContext,
            NewContext,
            PicsPath
        } = firstMsg;

        if (NotifyType === 1) { // 会员面试变更
            const newInfo = JSON.parse(NewContext);
            return (
                <div>会员{newInfo.UserName}（<span style={{color: '#108ee9', cursor: 'pointer'}} onClick={() => this.handleBrokerCall(newInfo.UserMobile)}>{newInfo.UserMobile}</span>）,面试{newInfo.RecruitName}现场<span style={{color: 'red'}}>放弃</span></div>
            );
        }

        if (NotifyType === 2) { // 招聘修改
            const newInfo = JSON.parse(NewContext);
            const oldInfo = JSON.parse(OldContext) || [];
            const oldInfoContent = (oldInfo.Content || []).filter(item => !!item.value);

            const beforeTag = oldInfoContent.length 
                ? (oldInfoContent || []).map((item, i) => (<span key={i}>{`${item.key}${item.value}${i === oldInfoContent.length - 1 ? '' : '；'}`}</span>))
                : '';

            const afterTag = (newInfo.Content || []).filter(item => item.key.indexOf('招聘状态') !== -1).length
                ? <span>{`${newInfo.Title.RecruitName}${newInfo.Title.DayType === 1 ? '今日' : '明日'}${newInfo.Content[0].value === '开启' ? '招聘' : '暂停招聘'}`}</span>
                : (newInfo.Content || []).map((item, i) => (<span key={i}>{`${item.key}${item.value}${i === (newInfo.Content || []).length - 1 ? '' : '；'}`}</span>));
            
            return (
                <div>
                    {beforeTag === '' ? '' : <div>修改前：{beforeTag}</div>}
                    <div style={{
                        color: beforeTag === '' ? 'inherit' : 'red'
                    }}>{beforeTag === '' ? '' : '修改后：'}{afterTag}</div>
                </div>
            );
        }

        if (NotifyType === 3) {// 自定义
            return (
                <div>
                    {NewContext}
                    <div className="imgs">
                        {(firstMsg.PicsPath || []).map((item, i) => (
                            <img style={{cursor: 'pointer'}} src={IMG_PATH + item} key={i} onClick={() => this.preview(item)} />
                        ))}
                    </div>
                </div>
            );
        }

        if (NotifyType === 5) {// 事件回复
            const eventMsg = JSON.parse(NewContext);
            return (
                <div>
                    {eventMsg.Remark !== '' ? (
                        <p style={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 3
                        }}>{eventMsg.Remark}</p>
                    ) : (
                        <img width="75" height="75" src={IMG_PATH + PicsPath[0]} />
                    )}
                </div>
            );
        }
    }

    renderMessage = (messageBuffer, message) => {
        if (!messageBuffer.length) {
            return '';
        } else {
            return this.packMessageContent(message);
        }
    }

    renderMsgTitle = (messageBuffer, message) => {
        if (messageBuffer.length) {
            const firstMsg = message;
            const { NotifyType, NewContext } = firstMsg;

            if (NotifyType === 1 || NotifyType === 4) {
                return (<div>面试变更</div>);
            }

            if (NotifyType === 2) {
                return (<div>{`${JSON.parse(NewContext).Title.RecruitName}${JSON.parse(NewContext).Title.DayType === 1 ? '今日' : '明日'}招聘信息修改`}</div>);
            }

            if (NotifyType === 3) {
                return '自定义消息';
            }

            if (NotifyType === 5) {
                return '事件回复';
            }
        } else {
            return '提醒';
        }
    }
    render() {
        const headerItems = {
            systemInfo: {
                route: '/broker/systemInfo'
            },
            alarmInfo: {
                route: '/broker/alarmInfo'
            },
            resource: {
                route: '/broker/resource'
            },
            needtodo: {
                pid: '16004',
                id: '16104',
                name: '待办',
                role: 'broker',
                route: '/broker/need-do'
            }
        };
        const accountName = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('accountName');
        const loginTime = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('loginTime');
        const departmentName = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('departmentName');
        const {rankLevel, todayGoal, rankName, lowLevel, entryCount, accountInfo, isPass, messageModalVisible} = this.props;
        // (((rankLevel === 1 && entryCount >= 23) || (rankLevel === 2 && entryCount >= 30) || (rankLevel === 3 && entryCount >= 40)
        // || (rankLevel === 4 && entryCount >= 45) || (rankLevel === 5 && entryCount >= 55) || (rankLevel === 6 && entryCount >= 65) || (rankLevel === 7 && entryCount >= 70) || (rankLevel === 8 && entryCount >= 80))
        return (
            <Header className={isPass ? 'bg-green' : 'bg-red8'}>
                <Row className="h-100">
                    <Col md={4} xs={0} className="h-100">
                        <p className="color-white font-20"
                           style={{whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden'}}>
                            经纪人工作台
                            <Link to="/broker/salary-calculator" className="ml-10" style={{
                                verticalAlign: 'middle'
                            }}>
                                <img src="http://woda-app-public.oss-cn-shanghai.aliyuncs.com/web/h5/icon_calculator.png" style={{
                                    width: '18px',
                                    verticalAlign: '-4px'
                                }} />
                                {/* <Icon type="calculator" style={{color: '#fff'}} /> */}
                            </Link>
                        </p>    
                    </Col>
                    <Col md={10} xs={14}>
                        <div style={{whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden'}}
                             className="level-tip text-center color-white font-18">
                            <span>
                                {rankName === '' || rankName === undefined ? '请稍等...' : '本月' + rankName}
                                {lowLevel === undefined ? '' : `（达标数：${lowLevel}）`}
                            </span>
                            <span className="ml-8 mr-8">|</span>
                            <span>
                                {this.props.entryCount === '' ? '请稍等...' : '本月入职数：' + this.props.entryCount}
                                {todayGoal === undefined ? '' : `（达标数：${todayGoal}）`}
                                </span>
                        </div>
                    </Col>
                    <Col span={10} className="operate text-right">
                        <div style={{display: 'inline-block'}}>
                            <Popover
                                mouseEnterDelay={0.5}
                                title="账户信息" trigger="hover" placement="bottomRight"
                                content={(
                                    <div style={{lineHeight: '30px', width: 300}}>
                                        <div>
                                            <span>工作状态 :</span>
                                            <span className="ml-8">
                                                <span
                                                    className={accountInfo.WorkingStatus === 1 ? 'color-primary' : ''}>{accountInfo.WorkingStatus === 1 ? '工作中' : accountInfo.WorkingStatus === 2 ? '休息中' : ''}</span>
                                            </span>
                                            <span className="ml-8">
                                                <Button
                                                    type="primary" size="small" ghost
                                                    onClick={this.handleSetWorkStatus.bind(this)}
                                                    disabled={accountInfo.WorkingStatus < 1 || accountInfo.WorkingStatus > 2}
                                                    loading={accountInfo.accountInformationSetStatusFetch.status === 'pending'}>
                                                    更改状态</Button>
                                            </span>
                                        </div>
                                        <div><span>所在团队 :</span><span className="ml-8">{accountInfo.TeamName}</span>
                                        </div>
                                        <div><span>被点赞次数 :</span><span className="ml-8">{accountInfo.Likes}</span></div>
                                        <div><span>本次登录 :</span><span
                                            className="ml-8">{loginTime ? new Date(loginTime).toLocaleString() : '-'}</span>
                                        </div>
                                        <div><span>登录地区 :</span><span
                                            className="ml-8">{accountInfo.loginAddress || ''}</span></div>
                                    </div>
                                )}
                                onVisibleChange={(visible) => {
                                    visible && accountInformationGet();
                                }}>
                                <div className="user-info">
                                    <i className="iconfont icon-wo color-white"/>
                                    <span className="user-name ml-2 color-white">{this.props.brokerInfo.NickName}</span>
                                </div>
                            </Popover>
                        </div>

                        <i className="iconfont icon-guanji ml-24 color-white cursor-pointer"
                           onClick={this.handleLogout.bind(this)}/>
                    </Col>
                    <div className="message-notify" id="message-notify"></div>

                <div>

                </div>
                <Modal visible={this.state.previewVisible} footer={null} onCancel={()=>this.setState({previewVisible: false})}>
                  <img alt="example" style={{ width: '100%' }} src={this.state.previewUrl} />
                </Modal>
                </Row>
                <Card bordered={false} bodyStyle={{padding: 0}} style={{
                    position: 'fixed',
                    bottom: 0,
                    right: 0,
                    zIndex: 2,
                    background: 'rgba(255,255,255,.7)'
                }}>
                    <div className="ivy-wait-item cursor-pointer" onClick={() => this.changePage(headerItems.needtodo)}>
                        <span className="font-16">需求</span>
                        {this.props.waitCount > 0 &&
                        <span className="ivy-badge">{this.props.waitCount}</span>}
                    </div>

                </Card>
                {/* {this.props.location.pathname !== '/broker/salary-calculator' && (
                    <Link to="/broker/salary-calculator" style={{
                        position: "fixed",
                        top: "200px",
                        right: "0",
                        zIndex: "999"
                    }}>
                        <Icon style={{
                            fontSize: "40px"
                        }} type="calculator" />
                    </Link>
                )} */}

                {/* {(this.props.location.pathname !== '/broker/salary-calculator' && this.state.showSalaryEntry) && (
                    <div style={{
                        position: "fixed",
                        bottom: "85px",
                        right: "2px",
                        zIndex: "999"
                   }}>
                       <div className="salary-calculator-entry" onClick={() => {
                           browserHistory.push({
                               pathname: '/broker/salary-calculator'
                           });
                       }}>
                           <img src="//woda-app-public.oss-cn-shanghai.aliyuncs.com/web/h5/WechatIMG2.png" />
                           <Icon type="close" onClick={(e) => {
                               e.stopPropagation();
                               this.setState({ showSalaryEntry: false});
                           }} />
                       </div>
   
                   </div>
                )} */}
                

                <PersonalRemindTip tipList={this.props.newPersonalRemindList}
                                   autoClose={this.props.newPersonalRemindAutoClose}/>
                <LaborExamModal 
                    ModalVisible={accountInfo.ModalExamVisible}
                    bPopup={accountInfo.bPopup}
                    hideModal={this.hideLaborExam.bind(this)}
                    />
                <FactoryExamModal 
                    ModalVisible={accountInfo.ModalFactoryVisible}
                    bPopup={accountInfo.bPopup}
                    hideModal={this.hideFactoryExam.bind(this)}
                    />
            </Header>
        );
    }
}

export default PageHeader;
