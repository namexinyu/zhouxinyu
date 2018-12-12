// import 'SCSS/framework.scss';
import 'LESS/framework.less';
import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import Dialogs from 'COMPONENT/Dialog';
import TabPage from 'VIEW/TabPage';
import PageHeader from 'VIEW/Header';
import PageSide from 'VIEW/SideNav/index';
import moment from 'moment';
import "LESS/pages/index.less";

moment.locale('zh-cn');

import {Layout} from 'antd';

const {Header, Footer, Sider, Content, Spin} = Layout;

class PageComponent extends React.PureComponent {
    render() {

        return (
            <div className="ivy-page ivy-scroll-box" style={{
                position: 'relative',
                height: '100%',
                width: '100%',
                left: 0,
                overflowX: 'hidden',
                overflowY: 'auto'
                // paddingBottom: '35px'
            }}>
                {this.props}
            </div>
        );
    }
}

export default createPureComponent(({children, location, state_header_accountInfo, state_dialog, state_sideNav, state_login, state_tabPage, store_broker}) => {
    return (
        <Layout style={{height: '100vh'}}>
            <PageHeader {...store_broker.state_broker_timingTask}
                        brokerInfo={{...store_broker.state_broker_information}}
                        loginInfo={{...state_login}} location={{...location}}
                        accountInfo={store_broker.state_broker_header_accountInfo}/>
            <Layout>
                <PageSide {...state_sideNav} waitCount={store_broker.state_broker_timingTask.waitCount} />
                <Content style={{position: 'relative', overflow: 'hidden'}}>
                    <TabPage {...state_tabPage} />
                    <PageComponent {...children} />
                </Content>
            </Layout>
        </Layout>
    );
});
