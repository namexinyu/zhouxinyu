import React from 'react';
import 'LESS/Finance/TradeManage/trade-manage.less';
import {
    Tabs,
    Badge
} from 'antd';
import ComplainLabor from './ComplainLabor';
import ComplainOrder from './ComplainOrder';
import setParams from 'ACTION/setParams';

const TabPane = Tabs.TabPane;

class Complain extends React.PureComponent {
    callback = (tabKey) => {
        setParams('state_finance_trade_complain', {tabKey});
    };

    render() {
        return (
            <div>
                <div className="ivy-page-title">
                    <h1>申诉订单</h1>
                </div>
                <Tabs activeKey={this.props.state_finance_trade_complain.tabKey} onChange={this.callback}
                      className="page-view-tabs">
                    <TabPane key="tab1"
                             tab={
                                 <div className="page-view-tabs-pane">
                                     <span>申诉订单</span>
                                     <Badge count={this.props.xxx || 0} style={{marginTop: -24}}/>
                                 </div>}>
                        <ComplainOrder
                            location={this.props.location}
                            common={this.props.common}
                            {...this.props.state_finance_trade_complain}/>
                    </TabPane>
                    <TabPane key="tab2"
                             tab={
                                 <div>
                                     <span>劳务记录</span>
                                     <Badge count={this.props.xx || 0} style={{marginTop: -24}}/>
                                 </div>}>
                        <ComplainLabor
                            location={this.props.location}
                            common={this.props.common}
                            {...this.props.state_finance_trade_complain_labor}/>
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}

export default Complain;