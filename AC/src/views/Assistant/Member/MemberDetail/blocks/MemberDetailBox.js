import React from 'react';
import {browserHistory} from 'react-router';

import BlockDetailInfoNew from './BlockDetailInfoNew';
import BlockDetailInfoNewHeader from './BlockDetailInfoNewHeader';
import BlockDetailFollowNew from './BlockDetailFollowNew';
import BlockDetailRecommendNew from './BlockDetailRecommendNew';
import BlockDetailMemberDemands from './BlockDetailMemberDemands';
import BlockCardTabRecords from './BlockDetailCardTabRecords';
import BlockDetailProcessTalk from './BlockDetailProcessTalk';
import BlockDetailProcessWait from './BlockDetailProcessWait';
import BlockMemberTagsNew from './BlockMemberTagsNew';
import BlockContact from './BlockContact';
import BlockUserFeature from './BlockUser7Feature';
import BlockUserImpressionCard from './BlockUserImpressionCard';
import BlockUserExpectation from './BlockUserExpectation';
import BlockPocket from './BlockPocket';
import BlockDetailZXX from './BlockDetailZXX';
import FactoryCheckinModal from './BlockFactoryCheckin';

import openDialog from 'ACTION/Dialog/openDialog';
import setParams from 'ACTION/setParams';
import resetState from 'ACTION/resetState';
import setFetchStatus from 'ACTION/setFetchStatus';
import getMemberDetailInfo from 'ACTION/Broker/MemberDetail/getMemberDetailInfo';
import setMemberAbnormal from "ACTION/Broker/MemberDetail/setMemberAbnormal";
import setMemberBanPost from "ACTION/Broker/MemberDetail/setMemberBanPost";
import getMemberAlarmList from 'ACTION/Broker/MemberDetail/getMemberAlarmList';
import brokerCall from 'ACTION/Broker/MemberDetail/brokerCallBack';
import deleteAlarm from 'ACTION/Broker/MemberDetail/deleteAlarm';
import createAlarm from 'ACTION/Broker/MemberDetail/createAlarm';
import getMemberScheduleMessageList from 'ACTION/Broker/MemberDetail/getMemberScheduleMessageList';
import getMemberStatusRecord from 'ACTION/Broker/MemberDetail/getMemberStatusRecord';
import getMemberContactRecord from 'ACTION/Broker/MemberDetail/getMemberContactRecord';
import getMemberInterviewRecord from 'ACTION/Broker/MemberDetail/getMemberInterviewRecord';
import getMemberDemandsInfo from 'ACTION/Broker/MemberDetail/getMemberDemandsInfo';
import getMemberWorkHistory from 'ACTION/Broker/MemberDetail/getMemberWorkHistory';
import getMemberRecommendList from 'ACTION/Broker/MemberDetail/getMemberRecommendList';
import getMemberFollowedRecruitList from 'ACTION/Broker/MemberDetail/getMemberFollowedRecruitList';
import getMemberTags from 'ACTION/Broker/MemberDetail/getMemberTags';
import helpMemberRecommend from 'ACTION/Broker/MemberDetail/helpMemberRecommend';
import BlockDetailModalOperate from './BlockDetailModalOperate';
import ActionMAMSRecruitment from 'ACTION/Common/Recruitment/ActionMAMSRecruitment';
import PocketAction from 'ACTION/Broker/Pocket';
import setMemberBaseInfo from 'ACTION/Broker/MemberDetail/setMemberBaseInfo';
import helpMemberApply from 'ACTION/Broker/MemberDetail/helpMemberApply';
import insertPreSign from 'ACTION/Broker/MemberDetail/insertPreSign';
import updatePreSign from 'ACTION/Broker/MemberDetail/updatePreSign';
import modifyMemberApply from 'ACTION/Broker/MemberDetail/modifyMemberApply';
import AutoCompleteSelect from 'COMPONENT/AutoCompleteSelect';
import getMemberApplyInfo from 'ACTION/Broker/MemberDetail/getMemberApplyInfo';
import getMemberPreSignInfo from 'ACTION/Broker/MemberDetail/getMemberPreSignInfo';
import getMemberEnrollRecord from 'ACTION/Broker/MemberDetail/getMemberEnrollRecord';
import getLatestEnrollRecord from 'ACTION/Broker/MemberDetail/getLatestEnrollRecord';
import getSevenFeature from 'ACTION/Broker/MemberDetail/getSevenFeature';
import getSevenFeatureConfig from 'ACTION/Broker/MemberDetail/getSevenFeatureConfig';
import updateSevenFeature from 'ACTION/Broker/MemberDetail/updateSevenFeature';
import AppSessionStorage from 'CONFIG/SessionStorage/AppSessionStorage';
// import MemberDetailService from 'SERVICE/Broker/MemberDetailService';
import removeMobileServices from 'SERVICE/Broker/removeMobile';
import formatDate from 'UTIL/base/formatDate';
import moment from 'moment';
const {
    getLatestPocketCase,
    updatePocketCase,
    setEstimatePick,
    updateMemberEnrollRecord,
    insertMemberEnrollRecord
} = PocketAction;
import doTabPage from 'ACTION/TabPage/doTabPage';
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
    Tag,
    Tabs,
    Tooltip,
    Popover
} from 'antd';
import getMemberList from 'ACTION/Broker/Member/getMemberList';
const TabPane = Tabs.TabPane;
const {TextArea} = Input;
const FormItem = Form.Item;
const {Option} = Select;
const Panel = Collapse.Panel;
const {Column, ColumnGroup} = Table;

const {
    GetMAMSRecruitFilterList
} = ActionMAMSRecruitment;

const STATE_NAME = 'state_broker_detail_member_operate';
const STATE_NAME_ALARM = 'state_broker_member_detail_alarm_clock';
const STATE_NAME_RECOMMEND = 'state_broker_member_detail_recommend_list';
const STATE_NAME_POCKET = 'state_broker_detail_pocket';
const text = <span>
<p>1.只有非认证手机号可以申请移除空号。</p>
<p>2.请先打电话确认是空号再申请移除，如果系统检测出不是空号，会扣经纪人信用分。</p>
<p>3.非空号不能移除。</p>
<p>4.移除空号后如果满足分资源条件，明日才会分资源。</p>
<p>5.同一个会员，点击【移除空号】按钮后，10分钟后才能再点击。</p>
</span>;
const fieldNameActionMap = {
  'createAlarmDate': STATE_NAME_ALARM,
  'createAlarmContent': STATE_NAME_ALARM,
  'createRecommendName': STATE_NAME_RECOMMEND,
  'createRecommendPhone': STATE_NAME_RECOMMEND,
  'createRecommendUserID': STATE_NAME_RECOMMEND,
  'expectedSignRecruit': STATE_NAME_POCKET,
  'expectedSignDate': STATE_NAME_POCKET,
  'expectedSignUserId': STATE_NAME_POCKET,
  'expectedSignPlace': STATE_NAME_POCKET,
  'HouseholdRegister': STATE_NAME_POCKET
};

function changeNumStyle(num) {
    return num <= 9 ? '0' + num : num;
}

function getTime(time) {
    let nowdate = new Date();
    nowdate.setDate(nowdate.getDate() + time);
    return nowdate.getFullYear() + "-" + changeNumStyle(+nowdate.getMonth() + 1) + "-" + changeNumStyle(nowdate.getDate());

}

function disabledDateTow(current) { // TODO这里有个权限限制
    const today = new Date();
    return current && new Date(formatDate(current)).getTime() < new Date(formatDate(today.setDate(today.getDate() + 1))).getTime();
}



class MemberDetailBox extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            showToggle: false,
            showRecommend: false,
            pageNum: "1",
            enableSetPick: false,
            zxxTabName: 'cards-tab',
            zxxRecordType: 'old',
            mainTabKey: '1',
            callListVisible: false,
            webCallVisible: false,
            removeMobile: true
        };
        this.tag = new Date().getTime() - 4000;
        this.eAbnormalType = {
            1: '禁言',
            2: '黑名单'
        };
    }

    componentWillMount() {
        getMemberDetailInfo({
            BrokerID: +this.props.router.params.brokerId,
            UserID: parseInt(this.props.router.params.userId, 10)
        });
        getMemberScheduleMessageList({
            BrokerID: +this.props.router.params.brokerId,
            UserID: parseInt(this.props.router.params.userId, 10)
        });
        GetMAMSRecruitFilterList();

        if (this.props.router.location.query.pageNum === "2") {
            this.setState({
                pageNum: "2"
            });
        }

        getLatestEnrollRecord({
          BrokerID: +this.props.router.params.brokerId,
          UserID: +this.props.router.params.userId,
          CaseStatus: 1
        });

        // getMemberApplyInfo({UserID: +this.props.router.params.userId});
        getMemberPreSignInfo({
          UserID: +this.props.router.params.userId,
          BrokerID: +this.props.router.params.brokerId
        });

        getSevenFeatureConfig();
        getSevenFeature({
            BrokerID: +this.props.router.params.brokerId,
            UserID: +this.props.router.params.userId
        });

    }
    componentDidUpdate() {
        if (this.props.detailInfo.userInfo.LastCheckTime !== "") {
            let hj = new Date(this.props.detailInfo.userInfo.LastCheckTime) - 0;
            let date = new Date() - 0;
            if (date - hj > 600000) {
                this.setState({
                    removeMobile: false
                });
            }else {
                
                if (date - hj) {
                    this.setState({
                        removeMobile: true
                    });
                    let item = setTimeout(() => {
                        this.setState({
                            removeMobile: false
                        });
                        clearTimeout(item);
                    }, 600000 - (date - hj));
                }
            }
        } else {
            this.setState({
                removeMobile: false
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        // console.log(this.props.detailInfo.userInfo, "获取详情信息");
 
        
        
        // 交互体验优化，若认证会员tab标签未显示真实姓名，替换为真实姓名
        // if (nextProps.detailInfo.getMemberDetailInfoFetch.status == 'success' && this.props.detailInfo.getMemberDetailInfoFetch.status != 'success') {
        //     let realName = (nextProps.detailInfo.userInfo || {}).Name;
        //     if (realName) {
        //         let tab = nextProps.tabList.find((item) => item.id == '/broker/member/detail/' + this.props.router.params.userId);
        //         if (tab && tab.name && tab.name.replace('会员详情-', '') != realName) {
        //             tab.name = '会员详情-' + realName;
        //             setParams('state_tabPage', [].concat(nextProps.tabList));
        //         }
        //     }
        // }

        const { pocketInfo, detailOperate, alarmClock, recommendList, processInfo } = nextProps;

        if (pocketInfo.getLatestEnrollRecordFetch.status === 'success') {
            setFetchStatus(STATE_NAME_POCKET, 'getLatestEnrollRecordFetch', 'close');

            // 设置口袋属性信息
            setParams(STATE_NAME_POCKET, {
                editPocketUserID: { value: pocketInfo.lastestEnrollRecord.UserID + '' },
                editDate: {value: moment(pocketInfo.lastestEnrollRecord.ExpectedDays)},
                editStatus: {value: pocketInfo.lastestEnrollRecord.CaseStatus ? pocketInfo.lastestEnrollRecord.CaseStatus.toString() : undefined},
                editRecruit: {
                    value: {
                        value: `${pocketInfo.lastestEnrollRecord.RecruitTmpID}`,
                        text: `${pocketInfo.lastestEnrollRecord.PositionName}`
                    }
                }
            });

            // getMemberEnrollRecord({
            //   BrokerID: brokerId,
            //   UserID: +this.props.router.params.userId,
            //   CaseStatus: 0,
            //   PageInfo: {
            //     Count: 20,
            //     Offset: 0
            //   }
            // });
        }

        if (pocketInfo.getLatestEnrollRecordFetch.status === 'error' && this.props.pocketInfo.getLatestEnrollRecordFetch.status !== 'error') {
            setFetchStatus(STATE_NAME_POCKET, 'getLatestEnrollRecordFetch', 'close');
            Modal.error({
                title: window.errorTitle.normal,
                content: pocketInfo.getLatestEnrollRecordFetch.response.Desc
            });
        }

        if ((pocketInfo && pocketInfo.lastestPocketCase && pocketInfo.lastestPocketCase.RecruitBasicID) && !this.hasPocket) {
            this.hasPocket = true;
        }
        if (detailOperate.setMemberAbnormalFetch.status === 'success') {
            message.success('标记异常申请已提交');
            setFetchStatus(STATE_NAME, 'setMemberAbnormalFetch', 'close');
            this.setState({
                showModal: 0
            });
        }
        if (detailOperate.setMemberAbnormalFetch.status === 'error') {
            Modal.error({
                title: window.errorTitle.normal,
                content: detailOperate.setMemberAbnormalFetch.response.Desc
            });
            setFetchStatus(STATE_NAME, 'setMemberAbnormalFetch', 'close');
        }
        if (detailOperate.setMemberBanPostFetch.status === 'success') {
            message.success('设置禁言申请已提交');
            setFetchStatus(STATE_NAME, 'setMemberBanPostFetch', 'close');
            this.setState({
                showModal: 0
            });
        }
        if (detailOperate.setMemberBanPostFetch.status === 'error') {
            Modal.error({
                title: window.errorTitle.normal,
                content: detailOperate.setMemberBanPostFetch.response.Desc
            });
            setFetchStatus(STATE_NAME, 'setMemberBanPostFetch', 'close');
        }
        if (alarmClock.deleteAlarmFetch.status === 'success') {
            setFetchStatus(STATE_NAME_ALARM, 'deleteAlarmFetch', 'close');
            message.success('删除成功');
            getMemberAlarmList({
                UserID: parseInt(this.props.router.params.userId, 10)
            });
        }
        if (alarmClock.deleteAlarmFetch.status === 'error') {
            setFetchStatus(STATE_NAME_ALARM, 'deleteAlarmFetch', 'close');
            Modal.error({
                title: window.errorTitle.normal,
                content: alarmClock.deleteAlarmFetch.response.Desc
            });
        }
        if (alarmClock.createAlarmFetch.status === 'success') {
            setFetchStatus(STATE_NAME_ALARM, 'createAlarmFetch', 'close');
            message.success('添加闹钟提醒成功');
            setParams(STATE_NAME_ALARM, {
                showCreateBox: false,
                createAlarmDate: '',
                createAlarmTime: '',
                createAlarmContent: ''
            });
            getMemberAlarmList({
                UserID: parseInt(this.props.router.params.userId, 10)
            });
        }
        if (alarmClock.createAlarmFetch.status === 'error') {
            setFetchStatus(STATE_NAME_ALARM, 'createAlarmFetch', 'close');
            Modal.error({
                title: window.errorTitle.normal,
                content: alarmClock.createAlarmFetch.response.Desc
            });
        }
        if (recommendList.helpMemberRecommendFetch.status === 'success') {
            setFetchStatus(STATE_NAME_RECOMMEND, 'helpMemberRecommendFetch', 'close');
            this.setState({
                showRecommend: false
            });
            let data = recommendList.helpMemberRecommendFetch.response.Data;
            if (data && data.ImportSuccessCount) {
                message.success('代推荐成功');
            } else if (data && data.ImportedCount) {
                message.error('代推荐失败，该用户已经注册');
            } else {
                message.success('代推荐成功');
            }
            setParams(STATE_NAME_RECOMMEND, {
                createRecommendName: '',
                createRecommendPhone: ''
            });
            getMemberRecommendList({
                UserID: parseInt(this.props.router.params.userId, 10),
                BrokerID: +this.props.router.params.brokerId
            });
        }

        if (recommendList.helpMemberRecommendFetch.status === 'error') {
            setFetchStatus(STATE_NAME_RECOMMEND, 'helpMemberRecommendFetch', 'close');
            Modal.error({
                title: window.errorTitle.normal,
                content: recommendList.helpMemberRecommendFetch.response.Desc
            });
        }

        // 处理设预签到相关流程
        if (processInfo.insertPreSignFetch.status === 'success' && this.props.processInfo.insertPreSignFetch.status !== 'success') {
            this.handleSetPrePick('insertPreSignFetch', nextProps);
        }

        if (processInfo.insertPreSignFetch.status === 'error' && this.props.processInfo.insertPreSignFetch.status !== 'error') {
            setFetchStatus('state_broker_member_detail_process', 'insertPreSignFetch', 'close');
            message.error(processInfo.insertPreSignFetch.response.Desc);
        }

        if (processInfo.updatePreSignFetch.status === 'success') {
            this.handleSetPrePick('updatePreSignFetch', nextProps);
        }

        if (processInfo.updatePreSignFetch.status === 'error' && this.props.processInfo.updatePreSignFetch.status !== 'error') {
            setFetchStatus('state_broker_member_detail_process', 'updatePreSignFetch', 'close');
            message.error(processInfo.updatePreSignFetch.response.Desc);
        }

        // if (nextProps.processInfo.brokerCallFetch.status === 'success') {
        //     setFetchStatus('state_broker_member_detail_process', 'brokerCallFetch', 'close');
        //     message.success('号码已推送，请在手机上直接拨打');
        // }

        // if (nextProps.processInfo.brokerCallFetch.status === 'error') {
        //     setFetchStatus('state_broker_member_detail_process', 'brokerCallFetch', 'close');
        //     message.error(nextProps.processInfo.brokerCallFetch.response.Desc);
        // }

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
            UserID: parseInt(this.props.router.params.userId, 10)
        });
        setParams(STATE_NAME_ALARM, {
            showAlarmList: true
        });
    }

    handleBrokerCall = (phone) => {
        console.log('handleBrokerCall', phone);
        brokerCall({
          BrokerID: +this.props.router.params.brokerId,
          Message: `${phone}`
        });
    }

    handleWebCallPopoverVisible = (visible) => {
      this.setState({
        webCallVisible: visible
      });
    }

    handleCallListVisibleChange = (flag) => {
      this.setState({ callListVisible: flag });
    }

    handleDeleteAlarm(item) {
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
                    UserID: parseInt(this.props.router.params.userId, 10),
                    RemindTime: this.props.alarmClock.createAlarmDate.value.format('YYYY-MM-DD HH:mm:ss'),
                    Content: this.props.alarmClock.createAlarmContent.value
                });
            }
        });
    }

    handleModalAbnormalOk() {
        this.props.form.validateFieldsAndScroll(['abnormalReason'], (errors, values) => {
            if (!errors) {
                setMemberAbnormal({
                    UserID: parseInt(this.props.router.params.userId, 10),
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
                    UserID: parseInt(this.props.router.params.userId, 10),
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

    handleZxxTabChange = (tabName, recordType) => {
      this.setState({
          zxxTabName: tabName,
          zxxRecordType: recordType
      });
    }

    handleTabChange(key) {
        this.setState({
          mainTabKey: key
        });
        if (key === "1") {
            getMemberContactRecord({
                BrokerID: +this.props.router.params.brokerId,
                UserID: +this.props.router.params.userId,
                RecordIndex: this.props.processInfo.contactIndex,
                RecordSize: this.props.processInfo.contactPageSize,
                StartTime: new Date(this.props.processInfo.contactStartTime).Format('yyyy-MM-dd hh:mm:ss'),
                EndTime: new Date(this.props.processInfo.contactEndTime.getFullYear(), this.props.processInfo.contactEndTime.getMonth(), this.props.processInfo.contactEndTime.getDate() + 1, 0, 0, 0).Format('yyyy-MM-dd hh:mm:ss')
            });

            getMemberDemandsInfo({
              BrokerID: +this.props.router.params.brokerId,
              UserID: +this.props.router.params.userId,
              RecordIndex: 0,
              RecordSize: 900000
            });

            getMemberInterviewRecord({
              UserID: +this.props.router.params.userId,
              PageInfo: {
                Count: 20,
                Offset: 0
              }
            });

            getLatestEnrollRecord({
              BrokerID: +this.props.router.params.brokerId,
              UserID: +this.props.router.params.userId,
              CaseStatus: 1
            });

            // getMemberStatusRecord({
            //     UserID: parseInt(this.props.router.params.userId, 10)
            // });
            // getMemberWorkHistory({
            //     UserID: parseInt(this.props.router.params.userId, 10)
            // });
        }
        // if (key === "2") {
        //     getMemberScheduleMessageList({
        //         UserID: parseInt(this.props.router.params.userId, 10)
        //     });
        // }
        if (key === "3") {
            getMemberRecommendList({
                UserID: parseInt(this.props.router.params.userId, 10),
                BrokerID: +this.props.router.params.brokerId
            });
        }
        if (key === "4") {
            getMemberFollowedRecruitList({
                UserID: parseInt(this.props.router.params.userId, 10),
                BrokerID: +this.props.router.params.brokerId
            });
        }
        if (key === "5") {
            getMemberTags({
                UserID: parseInt(this.props.router.params.userId, 10)
            });
        }
        // if (key === "6") {
        //     getLatestPocketCase({
        //         UserID: parseInt(this.props.router.params.userId, 10)
        //     });
        // }

        if (key === '7') {
          this.setState({
            zxxTabName: 'cards-tab',
            zxxRecordType: 'old'
          });
        }
    }

    handleRefreshPage() {
        let now = new Date().getTime();
        if ((now - this.tag) > 3000) {
          this.handleTabChange(this.state.mainTabKey);

            // getMemberContactRecord({
            //     BrokerID: brokerId,
            //     UserID: parseInt(this.props.router.params.userId, 10),
            //     RecordIndex: this.props.processInfo.contactIndex,
            //     RecordSize: this.props.processInfo.contactPageSize,
            //     StartTime: new Date(this.props.processInfo.contactStartTime).Format('yyyy-MM-dd hh:mm:ss'),
            //     EndTime: new Date(this.props.processInfo.contactEndTime.getFullYear(), this.props.processInfo.contactEndTime.getMonth(), this.props.processInfo.contactEndTime.getDate() + 1, 0, 0, 0).Format('yyyy-MM-dd hh:mm:ss')
            // });

            // getMemberStatusRecord({
            //     UserID: parseInt(this.props.router.params.userId, 10)
            // });

            // getMemberWorkHistory({
            //     UserID: parseInt(this.props.router.params.userId, 10)
            // });

            // getMemberScheduleMessageList({
            //     UserID: parseInt(this.props.router.params.userId, 10)
            // });

            // getMemberRecommendList({
            //     UserID: parseInt(this.props.router.params.userId, 10)
            // });

            // getMemberFollowedRecruitList({
            //     UserID: parseInt(this.props.router.params.userId, 10)
            // });

            // getMemberTags({
            //     UserID: parseInt(this.props.router.params.userId, 10)
            // });

            getMemberDetailInfo({
                UserID: parseInt(this.props.router.params.userId, 10)
            });

            this.tag = now;
        }
    }

    handleShowRecommendModal() {
        if (!this.props.recommendList.createRecommendUserID || (this.props.recommendList.createRecommendUserID.value != this.props.router.params.userId)) {
            setParams('state_broker_member_detail_recommend_list', {'createRecommendUserID': {value: this.props.router.params.userId}});
        }
        this.setState({
            showRecommend: true
        });
    }

    handleRecommendModalOk() {
        this.props.form.validateFieldsAndScroll(['createRecommendName', 'createRecommendPhone'], (errors, values) => {
            if (!errors) {
                const u_u = this.props.recommendList.createRecommendUserID;
                helpMemberRecommend({
                    Phone: this.props.recommendList.createRecommendPhone.value || '',
                    Name: this.props.recommendList.createRecommendName.value || '',
                    UserID: u_u && u_u.value ? u_u.value - 0 : parseInt(this.props.router.params.userId, 10)
                });
            }
        });
    }

    handleRecommendModalCancel() {
        this.setState({
            showRecommend: false
        });
    }

    handleShowSendBus() {
        setParams('state_broker_member_detail_process', {
            currentProcessStep: 'sendBus'
        });
    }

    handleSetPocket() {
        setParams('state_broker_member_detail_process', {
            editPocketUserID: {value: this.props.router.params.userId},
            currentProcessStep: 'setPocket'
        });
    }

    handleShowFactoryCheckin = () => {
        const param = {
            UserID: {value: this.props.router.params.userId - 0},
            Recruit: {value: undefined, text: undefined},
            CheckInDate: {value: moment()}
        };
        setParams('state_broker_md_factory', {
            Data: param,
            PicPath: {},
            OCR: {}
        });
    }

    // 显示设置预签到弹框
    handleShowSetSign = () => {
      const { pocketInfo, processInfo: { PreSignInfo }, allRecruitList, storeList, router: { params } } = this.props;
      console.log(PreSignInfo);
      this.setState({ enableSetPick: true });

      if (PreSignInfo) {
        // const existedRecruit = (allRecruitList.recruitFilterList || []).filter(item => item.RecruitTmpID == ApplyData.RecruitID)[0];
        // const existedHub = (storeList.storeList || []).filter(item => item.LocationID == ApplyData.GatherDepartID)[0];
        const existedRecruit = (allRecruitList.recruitFilterList || []).filter(item => item.RecruitName == PreSignInfo.PositionName)[0];
        const existedHub = (storeList.storeList || []).filter(item => item.LocationID == PreSignInfo.LocationID)[0];

        // setParams(STATE_NAME_POCKET, {
        //   expectedSignRecruit: {
        //     value: existedRecruit ? {
        //       value: ApplyData.RecruitID,
        //       text: existedRecruit.RecruitName
        //     } : {}
        //   },
        //   expectedSignDate: { value: moment().add(1, 'days') },
        //   expectedSignUserId: {
        //     value: ApplyData.UserID + ''
        //   },
        //   expectedSignPlace: {
        //     value: existedHub ? {
        //       value: ApplyData.GatherDepartID,
        //       text: existedHub.HubName
        //     } : {}
        //   }
        // });

        setParams(STATE_NAME_POCKET, {
          expectedSignRecruit: {
            value: existedRecruit ? {
              value: existedRecruit.RecruitTmpID,
              text: existedRecruit.RecruitName
            } : {}
          },
          expectedSignDate: { value: moment(PreSignInfo.PreCheckinTime) },
          expectedSignUserId: {
            value: this.props.router.params.userId + ''
          },
          expectedSignPlace: {
            value: existedHub ? {
              value: existedHub.LocationID,
              text: existedHub.HubName
            } : {}
          }
        });

      } else {
        setParams(STATE_NAME_POCKET, {
          expectedSignRecruit: { value: '' },
          expectedSignUserId: { value: params.memberId },
          expectedSignDate: { value: moment().add(1, 'days') },
          expectedSignPlace: {}
        });
      }

    }

    // 保存设置的预签到
    handleModalSetPickOk = () => {
      console.log(this.props.pocketInfo.lastestEnrollRecord);

      this.props.form.validateFieldsAndScroll(['expectedSignRecruit', 'expectedSignDate', 'expectedSignUserId', 'expectedSignPlace'], (errors, values) => {
        if (!errors) {
          const {
            brokerId,
            detailInfo: {
              userInfo
            },
            processInfo: {
              PreSignInfo
            },
            pocketInfo,
            router: {
              params
            }
          } = this.props;
          console.log('handleModalSetPickOk', this.props);
          

          const { expectedSignUserId, expectedSignRecruit, expectedSignDate, expectedSignPlace } = pocketInfo;

          if (PreSignInfo) {
            updatePreSign({
              BrokerID: brokerId,
              UserPreOrderID: PreSignInfo.UserPreOrderID,
              RecruitTmpID: expectedSignRecruit && expectedSignRecruit.value ? +expectedSignRecruit.value.value : 0,
              LocationID: expectedSignPlace && expectedSignPlace.value ? +expectedSignPlace.value.value : 0,
              PreCheckinTime: expectedSignDate && expectedSignDate.value ? expectedSignDate.value.format('YYYY-MM-DD') : '',
              CheckinStatus: 0
            });
          } else {
            insertPreSign({
              BrokerID: brokerId,
              UserID: expectedSignUserId && expectedSignUserId.value ? +expectedSignUserId.value : params.memberId,
              RecruitTmpID: expectedSignRecruit && expectedSignRecruit.value ? +expectedSignRecruit.value.value : 0,
              LocationID: expectedSignPlace && expectedSignPlace.value ? +expectedSignPlace.value.value : 0,
              PreCheckinTime: expectedSignDate && expectedSignDate.value ? expectedSignDate.value.format('YYYY-MM-DD') : ''
            });
          }

          if (Object.keys(pocketInfo.lastestEnrollRecord).length) { // 口袋属性有值
            if ((pocketInfo.lastestEnrollRecord.ExpectedDays !== expectedSignDate.value) || (+pocketInfo.lastestEnrollRecord.RecruitTmpID !== +expectedSignRecruit.value.value)) {
              updateMemberEnrollRecord({
                BrokerID: brokerId,
                CaseStatus: 0,
                ExpectedDays: expectedSignDate && expectedSignDate.value ? expectedSignDate.value.format('YYYY-MM-DD') : '',
                RecruitTmpID: expectedSignRecruit && expectedSignRecruit.value ? +expectedSignRecruit.value.value : 0,
                UserRecruitBasicID: pocketInfo.lastestEnrollRecord.UserRecruitBasicID,
                Remark: ''
              });
            }
          } else {
            insertMemberEnrollRecord({
              BrokerID: brokerId,
              ExpectedDays: expectedSignDate && expectedSignDate.value ? expectedSignDate.value.format('YYYY-MM-DD') : '',
              RecruitTmpID: expectedSignRecruit && expectedSignRecruit.value ? +expectedSignRecruit.value.value : 0,
              Remark: '',
              SourceType: 2,
              UserID: expectedSignUserId && expectedSignUserId.value ? +expectedSignUserId.value : params.memberId,
              CaseStatus: 1
            });
          }
        }
      });
    }

    // 处理保存预签到成功后的操作
    handleSetPrePick = (type, nextProps) => {
      this.handleModalSetPickCancel();
      message.success(type === 'insertPreSignFetch' ? '设置预签到成功' : '更新预签到成功');
      setFetchStatus('state_broker_member_detail_process', type, 'close');

      getMemberPreSignInfo({
        UserID: +this.props.router.params.userId,
        BrokerID: +this.props.router.params.brokerId
      });

      if (type === 'insertPreSignFetch') {

        // 重新拉取口袋属性信息
        getLatestEnrollRecord({
          BrokerID: +this.props.router.params.brokerId,
          UserID: +this.props.router.params.userId,
          CaseStatus: 1
        });

        browserHistory.push({
          pathname: '/broker/track/estimate-sign'
        });
      }
    }
    removeMobile = () => {
        let brokerInfo = this.props.brokerInfo; 
        let detailInfo = this.props.detailInfo;
        let router = this.props.router;
        let tabList = this.props.tabList;
        let props = this.props.MemberList;
        removeMobileServices.CheckMobile({Mobile: detailInfo.userInfo.Phone, AvatarPath: brokerInfo.AvatarPath, UserID: detailInfo.userInfo.UserID, BrokerName: brokerInfo.NickName, UserName: detailInfo.userInfo.NickName, BrokerID: brokerInfo.BrokerId}).then((data) => {
            getMemberDetailInfo({
                UserID: parseInt(router.params.memberId, 10)
            });
            if (data.Data.Status == 0 || data.Data.Status == 4 || data.Data.Status == 2) {
                Modal.confirm({
                    title: '提示',
                    content: `会员【${detailInfo.userInfo.NickName}】${detailInfo.userInfo.Phone}，此手机号为空号，确定移除，则关于该手机号的所有记录，将从你的后台移除。`,
                    okText: '确定移除',
                    okType: 'danger',
                    cancelText: '取消移除',
                    onOk() {
                        removeMobileServices.MoveNullNumber({AvatarPath: brokerInfo.AvatarPath, BrokerID: brokerInfo.BrokerID, BrokerName: brokerInfo.NickName, ChargesStatus: data.Data.ChargesStatus, Mobile: detailInfo.userInfo.Phone, Status: data.Data.Status, UserID: detailInfo.userInfo.UserID, UserName: detailInfo.userInfo.NickName}).then((data) => {
                            if (data.Code == 0) {
                                message.success(`会员【${detailInfo.userInfo.NickName}】已被移除`);
                                let arr = [];
                                tabList.map((item, index) => {
                                    if (item.singleTag && item.singleTag == "memberDetail") {             
                                    }else {
                                        arr.push(item);
                                    }
                                });
                                setParams("state_tabPage", {
                                    tabList: arr
                                });
                                browserHistory.push({
                                    pathname: '/broker/member/my'
                                });
                                let op = [];
                                let qp = [];
                                for (let k in props.orderParams) {
                                    if (props.orderParams[k] !== '') {
                                        op.push({
                                            Key: k,
                                            Order: props.orderParams[k]
                                        });
                                    }
                                }
                                for (let kk in props.queryParams) {
                                    if (props['q_' + kk] && props['q_' + kk].value && props['q_' + kk].value !== '') {
                                        if (kk === 'RegStartDate' || kk === 'RegStopDate') {
                                            qp.push({
                                                Key: kk,
                                                Value: props['q_' + kk].value ? props['q_' + kk].value.format('YYYY-MM-DD') : ''
                                            });
                                        } else {
                                            qp.push({
                                                Key: kk,
                                                Value: props['q_' + kk].value.toString().trim()
                                            });
                                        }
                        
                                    }
                                }
                                if (props.LastContactStartDate.value && props.LastContactStartDate.value !== "") {
                                    qp.push({
                                        Key: props.LastContactStartDate.name,
                                        value: props.LastContactStartDate.value.format('YYYY-MM-DD')
                                    });
                                }
                                if (props.LastContactStopDate.value && props.LastContactStopDate.value !== "") {
                                    qp.push({
                                        Key: props.LastContactStopDate.name,
                                        value: props.LastContactStopDate.value.format('YYYY-MM-DD')
                                    });
                                }
                                getMemberList({
                                    OrderParams: op,
                                    QueryParams: qp,
                                    RecordIndex: props.pageSize * (props.page - 1),
                                    RecordSize: props.pageSize
                                });
                            }
                        }).catch((data) => {
                            message.error(data.Desc);
                        });
                    },
                    onCancel() {
                      console.log('Cancel');
                    }
                  });
            }else if (data.Data.Status == -1) {
                message.error("未检测到该手机号，请稍后重试");
            } else {
                Modal.warning({
                    title: '提示',
                    content: `会员【${detailInfo.userInfo.NickName}】${detailInfo.userInfo.Phone}，此手机号非空号，不能移除。请先打电话确认是空号再申请移除。`
                });
            }
        }).catch((data) =>{
            message.error(data.Desc);
        });
    }
   
    // 隐藏设预签到弹框
    handleModalSetPickCancel = () => {
      this.setState({ enableSetPick: false });

      setParams(STATE_NAME_POCKET, {
        expectedSignPlace: {}
      });
    }
    // 事件录入
    handleEventInput = () => {
        const {
            entry,
            detailInfo: {
                userInfo = {}
            },
            interviewList: {
                interviewRecordList = []
            }
        } = this.props;
        
        setParams("state_broker_evententry", {
            queryParams: {
                ...entry.copyQueryParams,
                UserMobile: userInfo.Phone || '',
                UserName: userInfo.NickName || '',
                InterviewDate: interviewRecordList.length ? (interviewRecordList[0].InterviewDate ? moment(interviewRecordList[0].InterviewDate) : '') : '',
                RecruitName: {
                    value: interviewRecordList.length ? `${interviewRecordList[0].RecruitTmpID || ''}` : '',
                    text: interviewRecordList.length ? `${interviewRecordList[0].PositionName}` : ''
                }
            },
            interviewList: interviewRecordList,
            UserID: userInfo.UserID || 0
        });
        browserHistory.push({
            pathname: '/broker/event-management/entry'
        });
    }
    render() {
        const {getFieldDecorator} = this.props.form;
        const userInfo = this.props.detailInfo.userInfo || {};
        const userId = +this.props.router.params.userId;
        const brokerId = +this.props.router.params.brokerId;
        let abnormalReason = '';
        if (userInfo.AbnormalInfo && userInfo.AbnormalInfo.length > 0) {
            abnormalReason = userInfo.AbnormalInfo.map((item) => {
                return (this.eAbnormalType[item.Type] ? ('【' + this.eAbnormalType[item.Type] + '】') : '') + item.Reason;
            }).join(',');
        }

        return (
            <div className="member-detail-box">
                <Row type="flex" align="middle" style={{
                    padding: '6px 7px',
                    backgroundColor: '#f7fcff'
                }} className="member-detail__regular-row">
                    <Col span={24}>
                        <div className="flex flex--y-center flex--between">
                            <div className="flex__item flex flex--y-center">
                                {userInfo.IDCardCert &&
                                        <span className="iconfont icon-iconheji color-warning mr-5"
                                            style={{fontSize: '23px'}}/>}

                                {userInfo.IsWeekPay && <span
                                    className="iconfont icon-zhou color-primary mr-5"
                                    style={{fontSize: '23px'}}/>}

                                {userInfo.IsAbnormal && <span
                                        title={abnormalReason}
                                        className="iconfont icon-zhixingyichang color-grey mr-5"
                                        style={{fontSize: '23px', color: '#333'}}/>}

                                <span style={{
                                    fontSize: '19px',
                                    fontWeight: 'bold'
                                    }}>{(userInfo.Name || userInfo.CallName || userInfo.NickName || '')}</span>

                                    <span className="ml-10 member-info__phone" style={{
                                        fontSize: '16px'
                                    }}>{(this.props.detailInfo.userInfo && this.props.detailInfo.userInfo.Phone && this.props.detailInfo.userInfo.Phone.length >= 11 ? this.props.detailInfo.userInfo.Phone.substr(0, 3) + this.props.detailInfo.userInfo.Phone.substr(3, 4) + this.props.detailInfo.userInfo.Phone.substr(7) : '')}</span>

                                <BlockDetailInfoNewHeader {...this.props.detailInfo} brokerId={brokerId} />
                                {/* <Tooltip placement="bottom" title={text}>
                                    <span style={{color: "#ffff", background: "#000", width: "20px", height: "20px", borderRadius: "50%", textAlign: "center", lineHeight: "20px"}}>?</span>
                                </Tooltip>
                                <Button className="ml-8" disabled={this.state.removeMobile} type="primary" htmlType="button" onClick={() => this.removeMobile(1)} ghost>移除空号</Button>
                                <Button className="ml-8" type="primary" htmlType="button" onClick={() => this.handleShowModal(1)} ghost>转异常</Button>

                                <Button
                                    type="primary"
                                    htmlType="button"
                                    className="ml-8"
                                    onClick={this.handleShowSetSign} ghost>
                                    {this.props.processInfo.PreSignInfo ? '修改预签到' : '设预签到'}
                                </Button>

                                <Button type="primary" htmlType="button" className="ml-8"
                                        onClick={this.handleShowSendBus.bind(this)} ghost>代派车</Button>

                                <Button type="primary" htmlType="button" className="ml-8" 
                                        onClick={this.handleShowRecommendModal.bind(this)} ghost>代推荐</Button>

                                <Button type="primary" htmlType="button" className="ml-8"
                                        onClick={this.handleShowFactoryCheckin} ghost>厂门口接站</Button> */}
                            </div>

                            <div>
                                {/* <Button type="primary" onClick={this.handleEventInput}>事件录入</Button> */}
                                <Icon type="sync" style={{fontWeight: 600, color: '#108ee9'}} className="ml-10 cursor-pointer" onClick={this.handleRefreshPage.bind(this)} />
                            </div>
                            
                                
                                
                        </div>
                    </Col>
                </Row>

                <Row style={{
                    backgroundColor: '#fff'
                }} type="flex">
                    <Col span={9} style={{
                        border: '1px solid #aaaaaa',
                        backgroundColor: '#f0f0f0'
                    }}>
                      <div style={{height: '100%', padding: 10}} className="flex">
                          <div>
                            <Row>
                                <Col span={24}>
                                    <div>
                                        <BlockDetailInfoNew brokerId={brokerId} {...this.props.detailInfo} processInfo={this.props.processInfo} />
                                    </div>
                                </Col>
                            </Row>
                            <Row className="mt-14">
                                <Col span={24}>
                                    <div>
                                        <FormItem label="户籍" className="form-item__zeromb flexible-form-item">
                                            {getFieldDecorator('HouseholdRegister', {
                                            initialValue: (this.props.detailInfo.userInfo || {}).IDAddress ? (this.props.detailInfo.userInfo.IDAddress.split('市')[0].length > this.props.detailInfo.userInfo.IDAddress.split('县')[0].length ? this.props.detailInfo.userInfo.IDAddress.split('县')[0] + '县' : this.props.detailInfo.userInfo.IDAddress.split('市')[0]) + '市' : '-'
                                            })(<Input disabled={true} type="text"/>)}   
                                        </FormItem>
                                    </div>
                                </Col>
                            </Row>
                            <BlockContact {...this.props.processInfo}
                                            router={this.props.router}
                                            userInfo={this.props.detailInfo.userInfo}
                                            brokerId={brokerId}
                                            userId={userId}
                                            userName={this.props.detailInfo.userInfo.Name || this.props.detailInfo.userInfo.NickName || this.props.detailInfo.userInfo.CallName}
                                            userPhone={this.props.detailInfo.userInfo.Phone}
                                            userStatus={this.props.detailInfo.userInfo.Status}
                                            recruitList={this.props.recruitList} storeList={this.props.storeList}/>
                          </div>

                      </div>
                    </Col>
                    <Col span={15} style={{paddingLeft: 8}}>
                      <div>
                        <BlockUserImpressionCard
                             brokerId={brokerId}
                             impressionInfo={this.props.detailInfo.impressionInfo}
                             impressionConfigList={this.props.detailInfo.impressionConfigList}
                        />
                        <BlockUserExpectation
                            brokerId={brokerId}
                            expectationInfo={this.props.detailInfo.expectationInfo} />
                      </div>
                    </Col>
                </Row>

                <Row>

                    <Tabs defaultActiveKey={this.state.pageNum} tabBarStyle={{background: '#fff'}}
                          className="user-detail-tabs"
                          onChange={this.handleTabChange.bind(this)}>
                        <TabPane tab="会员记录" key="1">
                            <Row className="pl-8 pr-8">
                                <Row gutter={8}>
                                    <Col lg={12} md={24} sm={24}>
                                        <Row>
                                            {Object.keys(this.props.pocketInfo.lastestEnrollRecord).length ? (
                                              <BlockPocket allRecruitList={this.props.allRecruitList}
                                                          {...this.props.pocketInfo}
                                                           router={this.props.router}
                                                           storeList={this.props.storeList}
                                                           processInfo={this.props.processInfo}
                                                           enrollData={this.props.enrollData}
                                                           userId={userId}
                                                           brokerId={brokerId}
                                                           userMobileList={this.props.detailInfo.userInfo.List || []}
                                                           userName={this.props.detailInfo.userInfo.Name || this.props.detailInfo.userInfo.NickName || this.props.detailInfo.userInfo.CallName}
                                                           userPhone={this.props.detailInfo.userInfo.Phone}/>
                                            ) : (
                                              <div style={{
                                                  width: '100%',
                                                  height: '150px',
                                                  backgroundColor: 'white',
                                                  paddingTop: '50px',
                                                  textAlign: 'center'
                                              }}>
                                                  <Button htmlType="button" type="primary"
                                                          onClick={this.handleSetPocket.bind(this)}>装进口袋</Button>
                                              </div>
                                            )}
                                        </Row>
                                        <Row className="mt-8 mb-8">
                                            <BlockDetailProcessTalk {...this.props.processInfo}
                                                                    userId={userId}
                                                                    brokerId={brokerId}
                                                                    userName={this.props.detailInfo.userInfo.Name || this.props.detailInfo.userInfo.NickName || this.props.detailInfo.userInfo.CallName}
                                                                    userPhone={this.props.detailInfo.userInfo.Phone}
                                                                    userStatus={this.props.detailInfo.userInfo.Status}
                                                                    recruitList={this.props.recruitList}
                                                                    storeList={this.props.storeList}/>
                                        </Row>
                                    </Col>
                                    <Col lg={12} md={24} sm={24}>
                                        <Row>
                                            <BlockDetailMemberDemands
                                              processInfo={this.props.processInfo}
                                              brokerId={brokerId}
                                              userId={userId}
                                              demandsInfo={this.props.demandsInfo}
                                            />

                                        </Row>
                                        <Row className="mt-8 mb-8">
                                            <BlockCardTabRecords
                                              enrollData={this.props.enrollData}
                                              interviewData={this.props.interviewList}
                                              userId={userId}
                                              brokerId={brokerId}
                                            />
                                        </Row>
                                    </Col>
                                </Row>
                            </Row>

                        </TabPane>
                        <TabPane tab="Ta的推荐" key="3">
                            <Row className="pl-8 pr-8">
                                <BlockDetailRecommendNew {...this.props.recommendList}
                                                         userId={userId}
                                                         brokerId={brokerId}
                                                         userName={this.props.detailInfo.userInfo.Name || this.props.detailInfo.userInfo.NickName || this.props.detailInfo.userInfo.CallName}
                                                         userPhone={this.props.detailInfo.userInfo.Phone}/>
                            </Row>
                        </TabPane>
                        <TabPane tab="Ta的关注" key="4">
                            <Row className="pl-8 pr-8">
                                <BlockDetailFollowNew {...this.props.followedList}
                                                      userId={userId} brokerId={brokerId} />
                            </Row>
                        </TabPane>
                        {/* <TabPane tab="标签" key="5">
                            <Row className="pl-16 pr-16">
                                <BlockMemberTagsNew {...this.props.memberTags}
                                                    userId={userId}
                                                    userPhone={this.props.detailInfo.userInfo.Phone}/>
                            </Row>
                        </TabPane> */}

                        <TabPane tab="周薪薪" key="7">
                            <Row className="pl-8 pr-8">
                              <BlockDetailZXX tabName={this.state.zxxTabName} recordType={this.state.zxxRecordType} onChange={this.handleZxxTabChange} userInfo={this.props.detailInfo.userInfo} />
                            </Row>
                        </TabPane>
                    </Tabs>
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
                <Modal
                    title={'代' + (this.props.detailInfo.userInfo.Name || this.props.detailInfo.userInfo.CallName || this.props.detailInfo.userInfo.NickName || '') + '做推荐'}
                    visible={this.state.showRecommend}
                    onOk={this.handleRecommendModalOk.bind(this)}
                    onCancel={this.handleRecommendModalCancel.bind(this)}>
                    <Row>
                        <Col span={24}>
                            <FormItem label="注册姓名" labelCol={{span: 5}} wrapperCol={{span: 16}}>
                                {getFieldDecorator('createRecommendName', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '会员姓名必填'
                                        },
                                        {
                                            pattern: /^[\u4e00-\u9fa5a-zA-Z]+$/,
                                            message: '姓名必须为中文或英文字符'
                                        }
                                    ]
                                })(<Input maxLength="6" type="text" placeholder="请输入被推荐者的姓名"/>)}
                            </FormItem>
                        </Col>
                        <Col span={((this.props.detailInfo.userInfo || {}).List || []).length > 1 ? 24 : 0}>
                            <FormItem label="选择手机号" labelCol={{span: 5}} wrapperCol={{span: 16}}>
                                {getFieldDecorator('createRecommendUserID', {
                                    rules: []
                                })(<Select className="w-100" placeholder="选择手机号">
                                    {((this.props.detailInfo.userInfo || {}).List || []).map((v_v, i_i) => {
                                        return (<Option value={v_v.UserID + ''} key={i_i}>{v_v.Phone}</Option>);
                                    })}
                                </Select>)}
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <FormItem label="被推荐人电话" labelCol={{span: 5}} wrapperCol={{span: 16}}>
                                {getFieldDecorator('createRecommendPhone', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '手机号码必填'
                                        },
                                        {
                                            pattern: /^1[0-9][0-9]\d{8}$/,
                                            message: '请输入正确的11位手机号'
                                        }
                                    ]
                                })(<Input maxLength="11" type="tel" placeholder="请输入被推荐者的手机号码"/>)}
                            </FormItem>
                        </Col>
                    </Row>
                </Modal>
                <Modal
                    title={this.props.processInfo.PreSignInfo ? '修改预签到' : '设置预签到'}
                    okText='保存'
                    visible={this.state.enableSetPick}
                    onOk={this.handleModalSetPickOk}
                    onCancel={this.handleModalSetPickCancel}>
                    <Form>
                      <Row>
                        <Col span={24}>
                            <FormItem label="预签到企业" labelCol={{span: 7}} wrapperCol={{span: 17}}>
                                {getFieldDecorator('expectedSignRecruit', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '预签到企业必选'
                                        },
                                        {
                                            validator: (rule, value, cb) => {
                                                if (value && !value.value) {
                                                    cb('预签到企业必选');
                                                }
                                                cb();
                                            }
                                        }
                                    ]
                                })(<AutoCompleteSelect allowClear={true} optionsData={{
                                    valueKey: 'RecruitTmpID',
                                    textKey: 'RecruitName',
                                    dataArray: this.props.allRecruitList.recruitFilterList
                                }}/>)}
                            </FormItem>
                        </Col>
                      </Row>

                      <Row>
                        <Col span={24}>
                            <FormItem label="预签到日期" labelCol={{span: 7}} wrapperCol={{span: 17}}>
                                {getFieldDecorator('expectedSignDate', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '日期必填'
                                        }
                                    ]
                                })(<DatePicker className="w-100" disabledDate={disabledDateTow}/>)}
                            </FormItem>
                        </Col>
                      </Row>

                      <Row>
                        <Col span={(this.props.detailInfo.userInfo.List || []).length >= 1 ? 24 : 0}>
                            <FormItem label="预签到手机" labelCol={{span: 7}} wrapperCol={{span: 17}}>
                                {getFieldDecorator('expectedSignUserId', {
                                    rules: [{
                                      required: true,
                                      message: '手机号必填'
                                    }]
                                })(<Select className="w-100" placeholder="请选择手机号">
                                    {(this.props.detailInfo.userInfo.List || []).map((v_v, i_i) => {
                                        return (<Option value={v_v.UserID + ''} key={i_i}>{v_v.Phone}</Option>);
                                    })}
                                </Select>)}
                            </FormItem>
                        </Col>
                      </Row>

                      <Row>
                        <Col span={24}>
                            <FormItem label="预签到地点" labelCol={{span: 7}} wrapperCol={{span: 17}}>
                                {getFieldDecorator('expectedSignPlace', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '地点必选'
                                        },
                                        {
                                            validator: (rule, value, cb) => {
                                                if (value && !value.value) {
                                                    cb('地点必选');
                                                }
                                                cb();
                                            }
                                        }
                                    ]
                                })(<AutoCompleteSelect allowClear={true} optionsData={{
                                    valueKey: 'LocationID',
                                    textKey: 'HubName',
                                    dataArray: this.props.storeList.storeList
                                }}/>)}
                            </FormItem>
                        </Col>
                      </Row>
                    </Form>
                </Modal>
                {this.props.factoryCheckin.Data ? (
                    <FactoryCheckinModal
                        detail={this.props.factoryCheckin}
                        userInfo={this.props.detailInfo.userInfo}
                        allRecruitList={this.props.allRecruitList}
                        userMobileList={this.props.detailInfo.userInfo.List || []}/>
                ) : ''}

                <BlockDetailModalOperate {...this.props.processInfo}
                                            pocketInfo={this.props.pocketInfo}
                                            router={this.props.router}
                                            userId={userId}
                                            brokerId={brokerId}
                                            userName={this.props.detailInfo.userInfo.Name || this.props.detailInfo.userInfo.NickName || this.props.detailInfo.userInfo.CallName}
                                            userPhone={this.props.detailInfo.userInfo.Phone}
                                            userMobileList={this.props.detailInfo.userInfo.List || []}
                                            userStatus={this.props.detailInfo.userInfo.Status}
                                            recruitList={this.props.recruitList} storeList={this.props.storeList}
                                            brokerInfo = {this.props.brokerInfo}
                                            allRecruitList={this.props.allRecruitList}/>

            </div>
        );
    }
}

export default Form.create({
    mapPropsToFields(props) {
        const { detailOperate, recommendList, pocketInfo } = props;

        return {
            HouseholdRegister: pocketInfo.HouseholdRegister,
            abnormalReason: detailOperate.abnormalReason,
            banPostReason: detailOperate.banPostReason,
            createRecommendUserID: recommendList.createRecommendUserID,
            createRecommendName: recommendList.createRecommendName,
            createRecommendPhone: recommendList.createRecommendPhone,
            expectedSignRecruit: pocketInfo.expectedSignRecruit,
            expectedSignDate: pocketInfo.expectedSignDate,
            expectedSignUserId: pocketInfo.expectedSignUserId,
            expectedSignPlace: pocketInfo.expectedSignPlace
        };
    },
    onFieldsChange(props, fields) {
      setParams(fieldNameActionMap[Object.keys(fields)[0]] || STATE_NAME, {...fields});
    }
})(MemberDetailBox);
