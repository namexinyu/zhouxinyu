import 'LESS/framework.less';
import React from 'react';
import createPureComponent from 'UTIL/createPureComponent';
import PageHeader from 'VIEW/Header/index';
import PageSide from 'VIEW/SideNav/index';
import TabPage from 'VIEW/TabPage/index';
import {Layout, Breadcrumb} from 'antd';
import moment from 'moment';
import AppSessionStorage from 'CONFIG/SessionStorage/AppSessionStorage';
import "LESS/pages/restructures.less";


moment.locale('zh-cn');

const {Content} = Layout;

class PageComponent extends React.PureComponent {
    componentWillMount() {
        // for test start
        // let token = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('token') || '';
        // let employeeId = AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('employeeId') || '';
        // let accountList = JSON.parse(AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.getItem('accountList') || '[]');
        // if ( !token || !employeeId || !accountList || !accountList.length) {
        //     AppSessionStorage.LOGIN_INFO_SESSION_STORAGE.putItems({
        //         'token': 'P4BnFB+GFpSiyJyw7hxAi4kkMmPW4WeV5EFw0PVydAE=',
        //         'employeeId': 562,
        //         'role': ['BrokerBoss'],
        //         'accountList': '[{"listBrokerBoss": []}]'
        //     });
        // }
        // for test end
    }

    render() {
        return (
            <div className="ivy-page ivy-scroll-box">
                {this.props}
            </div>
        );
    }
}

export default createPureComponent(({children, location, state_dialog, state_sideNav, state_tabPage, store_ac}) => {
    return (
        <Layout style={{height: '100vh'}}>
            <PageHeader accountInfo={store_ac.state_ac_header_accountInfo}/>
            <Layout>
                <PageSide {...state_sideNav} />
                <Content style={{position: 'relative'}}>
                    <TabPage {...state_tabPage} />
                    <PageComponent {...children} />
                </Content>
            </Layout>
        </Layout>
    );
});
