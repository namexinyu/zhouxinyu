import React from 'react';
import 'LESS/Broker/header-resource-view.less';
import PageTitle from 'COMPONENT/PageTitle';
import {
    Tabs,
    Badge,
    message
} from 'antd';
import AlarmFeature from './AlarmFeature';
import AlarmPast from './AlarmPast';
import setParams from 'ACTION/setParams';

import getPersonalRemindCount from 'ACTION/Broker/TimingTask/getPersonalRemindCount';

const TabPane = Tabs.TabPane;
const STATE_NAME_PAST = 'state_broker_header_alarm_past';
const STATE_NAME_FEATURE = 'state_broker_header_alarm_feature';

class Alarm extends React.PureComponent {

    handleCallRefresh = () => {
        getPersonalRemindCount();
        setParams(STATE_NAME_PAST, {pageParam: {...this.props.past.pageParam, currentPage: 1}});
        setParams(STATE_NAME_FEATURE, {pageParam: {...this.props.feature.pageParam, currentPage: 1}});
    };

    callback = (tabKey) => {
        setParams(STATE_NAME_PAST, {tabKey});
    };

    render() {
        return (
            <div>
                <PageTitle title={<h1>闹钟</h1>} callRefresh={this.handleCallRefresh}/>
                <Tabs activeKey={this.props.past.tabKey} onChange={this.callback} className="page-view-tabs w-100">
                    <TabPane key="tab1"
                             tab={
                                 <div className="page-view-tabs-pane">
                                     <span>已过期</span>

                                     {this.props.past.personalRemindCount > 0 &&
                                     <span className="badge badge-pill badge-danger" style={{
                                         position: 'relative',
                                         top: -15
                                     }}>{this.props.past.personalRemindCount}
                                     </span>}
                                     {/* <Badge count={this.props.past.personalRemindCount || 0} style={{marginTop: -24}}/>*/}

                                 </div>}
                    >
                        <AlarmPast {...this.props.past} location={this.props.location}/>
                    </TabPane>
                    <TabPane key="tab2"
                             tab={
                                 <div>
                                     <span>未到期</span>
                                     <Badge count={this.props.xx || 0} style={{marginTop: -24}}/>
                                 </div>}>
                        <AlarmFeature {...this.props.feature} location={this.props.location}/>
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}

export default Alarm;