import React from 'react';
import 'LESS/Finance/TradeManage/trade-manage.less';
import {
    Tabs,
    Badge
} from 'antd';
import FeeBill from './FeeBill';
import FeeDetail from './FeeDetail';
import FeeSettle from './FeeSettle';
import setParams from 'ACTION/setParams';

const TabPane = Tabs.TabPane;


export default class Fee extends React.PureComponent {

    callback = (tabKey) => {
        setParams('state_finance_trade_fee_detail', {tabKey});
    };

    render() {
        return (
            <div>
                <div className="ivy-page-title">
                    <h1>收退费管理</h1>
                </div>
                <Tabs activeKey={this.props.state_finance_trade_fee_detail.tabKey} onChange={this.callback}
                      className="page-view-tabs">
                    <TabPane key="tab1"
                             tab={
                                 <div className="page-view-tabs-pane">
                                     <span>收退费明细</span>
                                     <Badge count={this.props.xxx || 0} style={{marginTop: -24}}/>
                                 </div>}>
                        <FeeDetail
                            location={this.props.location}
                            common={this.props.common}
                            {...this.props.state_finance_trade_fee_detail}
                        />
                    </TabPane>
                    <TabPane key="tab2"
                             tab={
                                 <div className="page-view-tabs-pane">
                                     <span>收退费交账</span>
                                     <Badge count={this.props.xx || 0} style={{marginTop: -24}}/>
                                 </div>}>
                        <FeeBill
                            location={this.props.location}
                            common={this.props.common}
                            {...this.props.state_finance_trade_fee_bill}
                        />
                    </TabPane>
                    <TabPane key="tab3"
                             tab={
                                 <div className="page-view-tabs-pane">
                                     <span>劳务结底价</span>
                                     <Badge count={this.props.xx || 0} style={{marginTop: -24}}/>
                                 </div>}>
                        <FeeSettle
                            location={this.props.location}
                            common={this.props.common}
                            {...this.props.state_finance_trade_fee_settle}
                        />
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}