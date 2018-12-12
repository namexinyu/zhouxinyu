import React from 'react';
import {Card} from 'antd';
import {financeOverview} from 'SERVICE/Finance/Overview';
import {message} from "antd/lib/index";
import 'LESS/Finance/Overview/overview.less';
import {browserHistory} from "react-router";

const OverviewItem = ({title, titleClass, Content, ContentClass, cardClick, footComponent}) => (
    <div className='card-item'>
        <Card onClick={cardClick}>
            <div className={'card-item-title' + (titleClass ? ' ' + titleClass : '')}>{title}</div>
            <div className={'card-item-content' + (ContentClass ? ' ' + ContentClass : '')}>{Content}</div>
            {footComponent}
        </Card>
    </div>
);


export default class Overview extends React.PureComponent {
    state = {};

    componentWillMount() {
        this.query();
    }

    query() {
        financeOverview({}, ({res, err}) => {
            if (res) {
                this.setState({...res});
            } else {
                message.error(err ? err : '查询失败');
            }
        });
    }

    handleItemClick = (item, type) => (e) => {
        e.stopPropagation();
        switch (item) {
            case 'UserSubsidy':
                browserHistory.push({
                    pathname: "/fc/trade-manage/subsidy",
                    query: type === 'card' ? {auditStatus: 2} :
                        type === 'auditStatus' ? {auditStatus: 3} : {payStatus: 3}
                });
                break;
            case 'InviteFee':
                browserHistory.push({
                    pathname: "/fc/trade-manage/invite",
                    query: {settleStatus: type === 'foot' ? 2 : 1}
                });
                break;
            case 'DrawingApply':
                browserHistory.push({
                    pathname: "/fc/account/withdraw",
                    query: {auditStatus: type === 'foot' ? 3 : 2}
                });
                break;
            case 'LaborPay':
                browserHistory.push({
                    pathname: "/fc/reconcile/service-bill",
                    query: {current: 1}
                });
                break;
            case 'LaborRecharge':
                browserHistory.push({
                    pathname: "/fc/account/labor-account"
                });
                break;
        }

    };

    overviewItems = [{
        title: '今日待审核补贴订单', key: 'UserSubsidy',
        Content: 'UserSubsidyTodayWaitCount', ContentClass: 'color-603',
        footList: [
            {foot: '今日已审核', footContent: 'UserSubsidyTodayHandleCount', key: 'auditStatus'},
            {foot: '今日已发放金额', footContent: 'UserSubsidyTodayHandleAmount', render: text => text / 100, key: 'payStatus'}
        ]
    }, {
        title: '今日待审核推荐费订单', key: 'InviteFee',
        Content: 'InviteFeeTodayWaitCount', ContentClass: 'color-c5005b',
        foot: '今日已审核', footContent: 'InviteFeeTodayHandleCount'
    }, {
        title: '今日待处理会员提现', key: 'DrawingApply',
        Content: 'DrawingApplyTodayWaitCount', ContentClass: 'color-f33',
        foot: '今日已审核', footContent: 'DrawingApplyTodayHandleCount'
    }, {
        title: '今日结算金额', key: 'LaborPay',
        Content: 'LaborPayTodayAmount', render: text => text / 100, ContentClass: 'color-5b8e00',
        foot: '本月已结算', footContent: 'LaborPayMonthAmount'
    }, {
        title: '今日劳务充值', key: 'LaborRecharge',
        Content: 'LaborRechargeTodayAmount', render: text => text / 100, ContentClass: 'color-33f',
        foot: '本月已充值', footContent: 'LaborRechargeMonthAmount'
    }];

    render() {
        console.log('========Overview render========');
        return (
            <div>
                <div className="ivy-page-title">
                    <h1>概况</h1>
                </div>
                <div style={{display: 'flex', flexWrap: 'wrap', marginTop: 24}}>
                    {this.overviewItems.map(item => {
                        let Content = this.state[item.Content] || 0;
                        let footComponent;
                        if (item.footList) {
                            footComponent = (
                                <div className='card-item-foot'>
                                    {item.footList.map((footItem, footIndex) => {
                                        let footContent = this.state[footItem.footContent] || 0;
                                        return (
                                            <div key={footItem.footContent} className="card-foot-line" onClick={this.handleItemClick(item.key, footItem.key)}>
                                                <span>{footItem.foot}</span>
                                                <span>{footItem.render ? footItem.render(footContent) : footContent}</span>
                                            </div>);
                                    })}
                                </div>);
                        } else {
                            let footContent = this.state[item.footContent] || 0;
                            footComponent = (<div className='card-item-foot card-foot-line'
                                                  onClick={this.handleItemClick(item.key, 'foot')}>
                                <span>{item.foot}</span>
                                <span>{item.render ? item.render(footContent) : footContent}</span>
                            </div>);
                        }
                        return <OverviewItem title={item.title}
                                             key={item.key}
                                             Content={item.render ? item.render(Content) : Content}
                                             ContentClass={item.ContentClass}
                                             footComponent={footComponent}
                                             cardClick={this.handleItemClick(item.key, 'card')}
                            // footClick={this.handleItemClick(item.key, 'foot')}
                        />;
                    })}
                </div>
            </div>
        );
    }
}