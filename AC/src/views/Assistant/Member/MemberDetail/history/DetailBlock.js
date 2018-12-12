import React from 'react';
import QueryParam from 'UTIL/base/QueryParam';
import MemberDetailAction from 'ACTION/Assistant/MemberDetailAction';
import resetState from 'ACTION/resetState';
import BlockInfo from './BlockInfo';
import setParams from 'ACTION/setParams';
import setFetchStatus from 'ACTION/setFetchStatus';
import BlockStatusRecord from './BlockStatusRecord';
import BlockWorkFollow from './BlockWorkFollow';
import BlockContactRecord from './BlockContactRecord';
import BlockFollow from './BlockFollow';
import BlockRecommend from './BlockRecommend';
import BlockPocket from './BlockPocket';
import BlockWait from './BlockWait';
import BlockTag from './BlockTag';
import {message, Row, Col, Icon, Menu, Button, Tabs, Tag, Dropdown} from 'antd';

const TabPane = Tabs.TabPane;
const {
    getMemberDetailInfo,
    getMemberFollowedRecruitList,
    getMemberRecommendList,
    getMemberScheduleMessageList,
    getMemberWorkHistory,
    getMemberStatusRecord,
    getMemberContactRecord,
    getMemberTags,
    getLatestPocketCase
} = MemberDetailAction;
const STATE_NAME = 'state_ac_memberDetail';

class DetailBlock extends React.PureComponent {
    constructor(props) {
        super(props);
        this.brokerId = parseInt(this.props.router.params.brokerId, 10);
        this.userId = parseInt(this.props.router.params.userId, 10);
        this.tag = new Date().getTime() - 4000;
        this.eAbnormalType = {
            1: '禁言',
            2: '黑名单'
        };
    }

    componentWillMount() {
        resetState(STATE_NAME);
        if (!this.brokerId || !this.userId) {
            message.error('用户ID或经纪人ID错误');
        } else {
            this.getData();
        }

    }

    getData() {
        let now = new Date();
        let sd = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 183, 0, 0, 0);
        let ed = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
        getMemberDetailInfo({
            BrokerID: this.brokerId,
            UserID: this.userId
        });
        getMemberScheduleMessageList({
            BrokerID: this.brokerId,
            UserID: this.userId
        });
        getLatestPocketCase({
            BrokerID: this.brokerId,
            UserID: this.userId,
            CaseStatus: 1
        });
        getMemberFollowedRecruitList({
            BrokerID: this.brokerId,
            UserID: this.userId
        });
        getMemberContactRecord({
            BrokerID: this.brokerId,
            UserID: this.userId,
            RecordIndex: 0,
            RecordSize: 20,
            StartTime: new Date(sd).Format('yyyy-MM-dd hh:mm:ss'),
            EndTime: new Date(ed.getFullYear(), ed.getMonth(), ed.getDate() + 1, 0, 0, 0).Format('yyyy-MM-dd hh:mm:ss')
        });
        getMemberRecommendList({
            BrokerID: this.brokerId,
            UserID: this.userId
        });
        getMemberWorkHistory({
            BrokerID: this.brokerId,
            UserID: this.userId
        });
        getMemberTags({
            BrokerID: this.brokerId,
            UserID: this.userId
        });
        getMemberStatusRecord({
            BrokerID: this.brokerId,
            UserID: this.userId
        });
    }

    handleRefreshPage() {
        let now = new Date().getTime();
        if ((now - this.tag) > 3000) {
            this.getData();
        }
    }

    handleTabChange(e) {
        setParams(STATE_NAME, {
            showTab: parseInt(e, 10)
        });
    }

    render() {
        const userInfo = this.props.userInfo || {};
        let abnormalReason = '';
        if (userInfo.AbnormalInfo && userInfo.AbnormalInfo.length > 0) {
            abnormalReason = userInfo.AbnormalInfo.map((item) => {
                return (this.eAbnormalType[item.Type] ? ('【' + this.eAbnormalType[item.Type] + '】') : '') + item.Reason;
            }).join(',');
        }
        return (
            <div>
                <div className="ivy-page-title">
                    {userInfo.IDCardCert &&
                    <span className="iconfont icon-iconheji color-warning mr-8"
                          style={{fontSize: '24px'}}/>}
                    {userInfo.IsWeekPay && <span
                        className="iconfont icon-zhou color-primary mr-8"
                        style={{fontSize: '24px'}}/>}
                    {userInfo.IsAbnormal && <span
                        title={abnormalReason}
                        className="iconfont icon-zhixingyichang color-grey ml-8"
                        style={{fontSize: '24px', color: '#333'}}/>}
                    <span style={{
                        fontSize: '18px',
                        fontWeight: 'bold'
                    }}>{(userInfo.Name || userInfo.CallName || userInfo.NickName || '')}</span>
                    <span style={{fontSize: '18px', fontWeight: 'bold'}}>({userInfo.Nation || '-'})</span>
                    <span style={{
                        fontSize: '18px',
                        fontWeight: 'bold'
                    }}>{'-' + (userInfo && userInfo.Phone ? userInfo.Phone : '')}</span>
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
                        <a className="ant-dropdown-link" style={{float: 'right'}} href="javascript:void(0)">
                            查看历史 <Icon type="down"/>
                        </a>
                    </Dropdown>}
                    <span className="ml-24">
                        <Icon type="credit-card" className="mr-8" style={{fontSize: '18px'}}/>
                        {userInfo.BankCardNum ? <span className="color-green">{userInfo.BankCardNum}张</span> :
                            <span className="color-red">0张</span>}
                    </span>
                    {new Date().getMonth() === new Date(userInfo.BirthDay).getMonth() && (new Date().getDate() === new Date(userInfo.BirthDay).getDate() || new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1).getDate() === new Date(userInfo.BirthDay).getDate()) &&
                    <span className="iconfont icon-wannianli-07" style={{
                        fontSize: '22px',
                        color: 'rgb(255, 202, 134)',
                        marginLeft: '100px'
                    }}></span>}
                    <span className="float-right">
                        <Button type="primary" htmlType="button" onClick={this.handleRefreshPage.bind(this)}>刷新</Button>
                    </span>
                </div>
                <BlockInfo {...this.props} />

                <Tabs defaultActiveKey={this.props.showTab.toString()} tabBarStyle={{background: '#fff'}}
                      className="user-detail-tabs"
                      onChange={this.handleTabChange.bind(this)}>
                    <TabPane tab="会员记录" key="1">
                        <Row className="pl-16 pr-16">
                            <Row gutter={16}>
                                <Col lg={12} md={24} sm={24}>
                                    <Row>
                                        <BlockPocket {...this.props} />
                                    </Row>
                                    <Row className="mt-16 mb-16">
                                        <BlockContactRecord {...this.props} brokerId={this.brokerId}
                                                            userId={this.userId}/>
                                    </Row>
                                </Col>
                                <Col lg={12} md={24} sm={24}>
                                    <Row>
                                        <BlockStatusRecord {...this.props} />
                                    </Row>
                                    <Row className="mt-16 mb-16">
                                        <BlockWorkFollow {...this.props} />
                                    </Row>
                                </Col>
                            </Row>
                        </Row>
                    </TabPane>
                    <TabPane tab={<div><span>待办处理</span><Tag color="red" className="float-right"
                                                             style={{marginLeft: '4px'}}>{this.props.waitRecord.length || 0}</Tag>
                    </div>} key="2">
                        <BlockWait {...this.props} />
                    </TabPane>
                    <TabPane tab="TA的推荐" key="3">
                        <BlockRecommend {...this.props} />
                    </TabPane>
                    <TabPane tab="TA的关注" key="4">
                        <BlockFollow {...this.props} />
                    </TabPane>
                    <TabPane tab="标签" key="5">
                        <BlockTag {...this.props} />
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}

export default DetailBlock;